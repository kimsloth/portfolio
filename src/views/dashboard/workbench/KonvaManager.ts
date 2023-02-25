import Konva from 'konva';
import amrUrl from '/@/assets/amrlong.png';
import chargeUrl from '/@/assets/charge.svg';

enum RobotState {
  Off = 'OFF',
  Wait = 'WAIT',
  Charge = 'CHARGE',
  Alarm = 'ALARM',
  Transfer = 'TRANSFER',
  PreRun = 'PRERUN',
  Parking = 'PARKING',
  Load = 'LOAD',
}

enum RACK_TYPE {
  NONE = 'NONE',
  TM = 'TM',
  LX = 'LX',
  PLT = 'PLT',
}

enum RACK_INNER {
  COUNT = 'COUNT',
  NUM = 'NUM',
}

enum KONVA_ID {
  NONE = 'NONE',
  MAIN_STAGE = 'MAIN_STAGE',
  ROBOT_GROUP = 'ROBOT_GROUP',
  RACK_GROUP = 'RACK_GROUP',
  LINE_GROUP = 'LINE_GROUP',
  PONT_GROUP = 'PONT_GROUP',
  BACK_GROUND = 'BACK_GROUND',
  PATH_GROUP = 'PATH_GROUP',
  ROUTE_GROUP = 'ROUTE_GROUP',
}

enum GROUP_ZINDEX {
  ROUTE_GROUP = 2,
  PATH_GROUP = 10,
  ROBOT_GROUP = 5,
  LINE_GROUP = 1,
  PONT_GROUP = 3,
  RACK_GROUP = 4,
}

enum GROUP_SCALE {
  ROBOT_GROUP = 2.5,
  LINE_GROUP = 5,
  PONT_GROUP = 5,
  RACK_GROUP = 7,
}

enum OBJECT_SIZE {
  OUTER = 50,
  INNER_WIDTH = 40,
  INNER_HEIGHT = 40,
  INNER_FONT_SIZE = 35,
  OUTER_TEXT = 200,
  LINE_TEXT = 230,
}

interface Robots {
  [key: string]: Konva.Shape;
}

interface Label {
  [key: string]: Konva.Label;
}

interface Orders {
  [key: string]: Konva.Shape | any;
}

export interface Emit {
  (e: string, v: string): void;
}

class MapManager {
  private mapId = '' as string;
  private _width = 0 as number;
  private _height = 0 as number;
  private _emit = undefined as Emit | undefined;
  private stage = undefined as Konva.Stage | any;
  private mapLayer = undefined as Konva.Layer | any;
  private points = {} as { [key: string]: { x: number; y: number } };
  private rackShape = {} as any;
  private robotOrder = {} as Orders;
  private robotRoute = new Konva.Group();
  private robotPaths = new Konva.Group();
  private cloneArrow = new Konva.Arrow();
  private robotAni = {} as { target: Konva.Shape | undefined; animation: any };
  private intervalCheck = undefined as any;
  robots = {} as Robots;
  robotName = {} as Label;
  orderNumber = {} as Orders;

  constructor(width: number, height: number, emit: Emit) {
    this.width = width;
    this.height = height;
    this.emit = emit;
  }

  get emit() {
    return this._emit;
  }

  set emit(value: any) {
    this._emit = value;
  }

  get width() {
    return this._width;
  }

  set width(value: number) {
    this._width = value < 0 ? 0 : value;
  }

  get height() {
    return this._height;
  }

  set height(value: number) {
    this._height = value < 0 ? 0 : value;
  }

  createStage(): void {
    this.stage = new Konva.Stage({
      container: 'container',
      width: 1000,
      height: 1000,
      draggable: true,
    });
  }

  createTest(): void {}

  calcStageCenterPoint(width: number, height: number): { x: number; y: number } {
    let x = this.stage.width() - width;
    let y = this.stage.height() - height;
    if (x > 0) {
      x = x * 0.5;
    } else {
      x = 0;
    }
    if (y > 0) {
      y = y * 0.5;
    } else {
      y = 0;
    }
    return { x: x, y: y };
  }

  async createLayer(): Promise<void> {
    this.mapLayer = new Konva.Layer({
      x: 10,
      y: 10,
    });

    const dev = new Konva.Rect({
      id: KONVA_ID.BACK_GROUND,
      x: 100,
      y: 100,
      width: 400,
      height: 400,
      opacity: 0.1,
      fill: 'sky',
      stroke: 'black',
      strokeWidth: 4,
    });

    const rect = new Konva.Rect({
      fill: 'red',
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      offsetY: 250,
      offsetX: 250,
    });
    this.mapLayer.add(rect);
    this.stage.add(this.mapLayer);

    const amplitude = 100;
    const period = 2000;

    const centerX = this.stage.width() / 2;

    const angularSpeed = 90;
    const anim = new Konva.Animation(function (frame) {
      const angleDiff = (frame.timeDiff * angularSpeed) / 1000;
      rect.rotate(angleDiff);
      rect.y(amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + centerX);
    }, this.mapLayer);

    anim.start();

    rect.on('mouseover', function () {
      this.fill('yellow');
    });

    rect.on('mouseout', function () {
      this.fill('skyblue');
    });
  }

  async createShape(): Promise<void> {
    this.createObject();

    this.stage.add(this.mapLayer);
    this.mapLayer.draw();
  }

  createName(robot, group): Konva.Label {
    const tooltip = new Konva.Label({
      x: robot.x() ?? 0,
      y: robot.y() - robot.height() * GROUP_SCALE.ROBOT_GROUP ?? 0,
      scale: { x: GROUP_SCALE.ROBOT_GROUP * 1.5, y: GROUP_SCALE.ROBOT_GROUP * 1.5 },
    });

    tooltip.add(
      new Konva.Tag({
        fill: '#090909',
        pointerDirection: 'down',
        pointerWidth: 15,
        pointerHeight: 10,
        lineJoin: 'round',
        cornerRadius: 5,
      }),
    );

    tooltip.add(
      new Konva.Text({
        text: robot.getAttr('id'),
        fontFamily: 'Calibri',
        fontStyle: 'bold',
        fontSize: 50,
        padding: 4,
        fill: '#f8f6f6',
      }),
    );

    group.add(tooltip);

    return tooltip;
  }

  setAMR(data) {
    const robot = this.robots[data.agvId];
    if (robot) {
      const name = this.robotName[data.agvId];
      const order = this.robotOrder[data.agvId];

      const point = this.points;

      const x = point[data.currentNode]?.x ?? 0;
      const y = point[data.currentNode]?.y ?? 0;
      const r = this.setRotation(data.angle);

      if (x !== robot.x() || y !== robot.y()) {
        this.makeTween(robot, name, order, x, y, r);
      }

      this.setColor(robot, data.currentStatus);
    }
  }

  createImage(): Promise<Konva.Shape> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const robot = new Konva.Image({
          x: 0,
          y: 0,
          image: img,
          scale: { x: GROUP_SCALE.ROBOT_GROUP, y: GROUP_SCALE.ROBOT_GROUP },
          offset: {
            // default 0 !!
            x: img.width / 2,
            y: img.height / 2,
          },
          rotation: 0, // offset x,y 를 기준으로 돌아감 그래서 offset을 너비의 반으로 옮겨야지 가운데서 돌아감
        });

        robot.on('click tap', async (e) => {
          const id = e.target.getAttr('id') as string;
          this.emit('openDesc', id);
          await this.openDescription(id);
        });

        robot.on('mouseenter', () => {
          this.stage.container().style.cursor = 'pointer';
        });

        robot.on('mouseleave', () => {
          this.stage.container().style.cursor = 'default';
        });

        resolve(robot);
      };
      img.src = amrUrl;
    });
  }

  removeAnimation() {
    if (this.robotAni.target) {
      this.robotAni.animation.stop();
      this.robotAni.animation = undefined;
      this.robotAni.target.setAttr('opacity', 1);
      this.robotAni.target = undefined;
    }
  }

  makeAnimation(id: string) {
    const shape = this.robots[id];
    if (shape) {
      this.robotAni.target = shape;

      let opacity = 0;
      let cacuDirection = true;

      this.robotAni.animation = new Konva.Animation((frame) => {
        if (frame) {
          if (cacuDirection) {
            opacity = Math.round((opacity + 0.03) * 100) / 100;
          } else {
            opacity = Math.round((opacity - 0.03) * 100) / 100;
          }
          if (opacity > 1) {
            cacuDirection = false;
            opacity = 1;
          } else if (opacity <= 0) {
            cacuDirection = true;
            opacity = 0;
          }
          shape.setAttr('opacity', opacity);
        }
      }, this.mapLayer);

      this.robotAni.animation.start();
    }
  }

  cancelRouteInterval() {
    if (this.intervalCheck) {
      clearInterval(this.intervalCheck);
    }
  }

  startRouteInterval(id: string) {
    this.intervalCheck = setInterval(async () => {
      await this.makeRoutes(id);
    }, 10000);
  }

  async openDescription(id: string) {
    this.removeDescription();
    this.makeAnimation(id);
    await this.makeRoutes(id);
    this.startRouteInterval(id);
  }

  removeDescription(): void {
    this.removeAnimation();
    this.removeRoutes();
    this.cancelRouteInterval();
  }

  removePath(): void {
    if (this.robotPaths) {
      this.robotPaths.destroy();
    }
  }

  createArrow(points, group) {
    const arrow = this.cloneArrow.clone({
      points: points,
    });

    group.add(arrow);
  }

  makePath(data): void {
    this.removePath();

    const point = this.points;

    const group = new Konva.Group({ id: KONVA_ID.PATH_GROUP });

    for (let i = 0; i < data.length; i++) {
      const agvNode = data[i].agvNode;
      const fromX = point[data[i].from]?.x;
      const fromY = point[data[i].from]?.y;
      const toX = point[data[i].to]?.x;
      const toY = point[data[i].to]?.y;
      let points: number[] = [];

      if (agvNode) {
        const agvNodeX = point[data[i].agvNode]?.x;
        const agvNodeY = point[data[i].agvNode]?.y;

        points = [fromX, fromY, agvNodeX, agvNodeY];
        this.createArrow(points, group);

        points = [agvNodeX, agvNodeY, toX, toY];
        this.createArrow(points, group);
      } else {
        if (fromX && fromY && toX && toY) {
          points = [fromX, fromY, toX, toY];
          this.createArrow(points, group);
        }
      }
    }

    this.mapLayer.add(group);

    this.robotPaths = group;

    group.zIndex(GROUP_ZINDEX.PATH_GROUP);
  }

  async makeRoutes(id: string): Promise<void> {
    const point = this.points;

    const list: number[] = [];
    data.forEach((item) => {
      if (point[item]?.x && point[item]?.y) {
        list.push(point[item].x);
        list.push(point[item].y);
      }
    });

    const group = new Konva.Group({ id: KONVA_ID.ROUTE_GROUP });

    const circle = new Konva.Circle({
      x: list[0],
      y: list[1],
      radius: 25,
      fill: '#ff51f6',
    });

    const arrow = new Konva.Arrow({
      points: [...list],
      pointerLength: 30,
      pointerWidth: 40,
      stroke: '#ff51f6',
      strokeWidth: 16,
    });

    group.add(circle, arrow);

    this.mapLayer.add(group);

    this.robotRoute = group;

    group.zIndex(GROUP_ZINDEX.ROUTE_GROUP);
  }

  removeRoutes(): void {
    if (this.robotRoute) {
      this.robotRoute.destroy();
    }
  }

  makeTween(
    robot: Konva.Shape,
    name: Konva.Label,
    order: Konva.Shape,
    x: number,
    y: number,
    angle: number,
  ) {
    let rotateTween: any = new Konva.Tween({
      node: robot,
      rotation: angle,
      onFinish: () => {
        rotateTween.destroy();
        rotateTween = undefined;
        let positionOrder: any = new Konva.Tween({
          node: order,
          duration: 1,
          easing: Konva.Easings.EaseInOut,
          x: x,
          y: y,
          onFinish: () => {
            positionOrder.destroy();
            positionOrder = undefined;
          },
        }).play();

        let positionName: any = new Konva.Tween({
          node: name,
          duration: 1,
          easing: Konva.Easings.EaseInOut,
          x: x,
          y: y - robot.height() * GROUP_SCALE.ROBOT_GROUP,
          onFinish: () => {
            positionName.destroy();
            positionName = undefined;
          },
        }).play();

        let positionRobot: any = new Konva.Tween({
          node: robot,
          duration: 1,
          easing: Konva.Easings.EaseInOut,
          x: x,
          y: y,
          onFinish: () => {
            positionRobot.destroy();
            positionRobot = undefined;
          },
        }).play();
      },
    }).play();
  }

  setRotation(angle: string) {
    let r = 0;
    switch (angle) {
      case '1':
        r = 270;
        break;
      case '2':
        r = 0;
        break;
      case '3':
        r = 90;
        break;
      case '4':
        r = 180;
        break;
    }
    return r;
  }

  copyShape(copyTarget: Konva.Shape, item: any, group: Konva.Group): Konva.Shape {
    const list = this.points;

    const robot = copyTarget.clone({
      id: item.agvId,
      x: list[item.currentNode]?.x ?? 0,
      y: list[item.currentNode]?.y ?? 0,
      rotation: this.setRotation(item.angle),
    });

    this.setColor(robot, item.currentStatus);

    group.add(robot);

    this.robotName[item.agvId] = this.createName(robot, group);

    return robot;
  }

  setColor(shape: Konva.Shape, state: any): void {
    shape.cache();
    shape.filters([Konva.Filters.RGB]);
    let color;

    // 알람이라는 글자가 포함 되어있으면 무조건 알람
    if (state.toUpperCase().includes('ALARM')) {
      state = RobotState.Alarm;
    }

    shape.red(color.RED);
    shape.blue(color.BLUE);
    shape.green(color.GREEN);
    shape.alpha(color.ALPHA);
  }

  createObject() {
    const rect1 = new Konva.Rect({
      width: OBJECT_SIZE.OUTER,
      height: OBJECT_SIZE.OUTER,
      fill: 'white',
      stroke: 'black',
      strokeWidth: 1,
      cornerRadius: 7,
    });

    const imageObj = new Image();
    imageObj.src = 'C:/Users/DELL/Downloads/map(3)';
    const yoda = new Konva.Image({
      x: 50,
      y: 50,
      image: imageObj,
      width: 106,
      height: 118,
    });

    // add the shape to the layer
    this.mapLayer.add(yoda);
    this.mapLayer.add(rect1);
  }

  getChildrenByOne(shape, id) {
    const child = shape.getChildren(function (node) {
      return node.getAttr('id') === id;
    });
    return child[0];
  }

  createDepotName(rack, data, locationLX, locationTM) {
    let numberText;
    let group;

    // 각 라인의 이름을 표기하기 위한 세팅, db에 따로 값이 없고 하드코딩
    if (data.lineNumber == '1') {
      numberText = '1';
      group = locationLX;
    } else if (data.lineNumber == '2') {
      numberText = '2';
      group = locationLX;
    } else if (data.lineNumber == '3') {
      numberText = '1';
      group = locationTM;
    } else if (data.lineNumber == '4') {
      numberText = '2';
      group = locationTM;
    } else if (data.lineNumber == '5') {
      numberText = '3';
      group = locationTM;
    } else if (data.lineNumber == '6') {
      numberText = '4';
      group = locationTM;
    } else {
      return;
    }

    const tooltip = new Konva.Label({
      x: rack.x(),
      y: rack.y() - 180,
    });

    tooltip.add(
      new Konva.Tag({
        pointerDirection: 'down',
      }),
    );

    tooltip.add(
      new Konva.Text({
        text: numberText,
        fontFamily: 'Calibri',
        fontStyle: 'bold',
        fontSize: OBJECT_SIZE.OUTER_TEXT,
        fill: '#000000',
      }),
    );

    group.add(tooltip);

    this.mapLayer.add(group);
  }

  async createDepot(): Promise<void> {
    const group = new Konva.Group({ id: KONVA_ID.RACK_GROUP });

    const list = await api.getDepots();

    const point = this.points;

    const locationTM = new Konva.Group({ id: RACK_TYPE.TM });
    const locationLX = new Konva.Group({ id: RACK_TYPE.LX });

    for (let i = 0; i < list.length; i++) {
      const rack = this.rackShape.clone({
        id: list[i].lineNumber,
        x: point[list[i].nodeName]?.x ?? 0,
        y: point[list[i].nodeName]?.y ?? 0,
      });

      this.createDepotName(rack, list[i], locationLX, locationTM);

      this.setDepot(rack, list[i]);

      group.add(rack);

      this.orderNumber = { ...this.orderNumber, ...{ [list[i].lineNumber]: rack } };
    }

    this.createLocationName(locationTM, locationLX);

    this.mapLayer.add(group);

    group.zIndex(GROUP_ZINDEX.RACK_GROUP);
  }

  createLocationName(locationTM, locationLX) {
    const tooltipTM = new Konva.Label({
      x: locationTM.children[1].x() - locationLX.children[1].width() * 2,
      y: locationTM.children[1].y() - 200,
    });

    tooltipTM.add(
      new Konva.Tag({
        pointerDirection: 'down',
      }),
    );

    tooltipTM.add(
      new Konva.Text({
        text: RACK_TYPE.TM,
        fontFamily: 'Calibri',
        fontStyle: 'bold',
        fontSize: OBJECT_SIZE.LINE_TEXT,
        fill: '#000000',
      }),
    );

    const tooltipLX = new Konva.Label({
      x: locationLX.children[1].x() + locationLX.children[1].width() * 2,
      y: locationLX.children[1].y() - 200,
    });

    tooltipLX.add(
      new Konva.Tag({
        pointerDirection: 'down',
      }),
    );

    tooltipLX.add(
      new Konva.Text({
        text: RACK_TYPE.LX + 2,
        fontFamily: 'Calibri',
        fontStyle: 'bold',
        fontSize: OBJECT_SIZE.LINE_TEXT,
        fill: '#000000',
      }),
    );

    this.mapLayer.add(tooltipTM, tooltipLX);
  }

  setDepot(rack, data) {
    if (rack) {
      let child;
      let childCount;

      const removeList = rack.getChildren();
      removeList.map((item) => item.setAttr('visible', false));

      if (data?.liftStatus === 'DOWN') {
        // liftStatus 는 로봇의 리프트 상태가 DOWN 이 아닌경우 사용 로봇만 표기!
        return;
      }

      if (data?.pltOn == 0) {
        // 파레트 없음
        child = this.getChildrenByOne(rack, RACK_TYPE.NONE);
      } else {
        // 공파레트 = 파레트 있는데 파트 없음
        if (data.pltCnt == 0) {
          child = this.getChildrenByOne(rack, RACK_TYPE.PLT);
        } else {
          if (
            data.lineNumber?.includes(RACK_TYPE.LX) ||
            data.lineNumber === '1' ||
            data.lineNumber === '2' ||
            data.pltNum.toString().includes(RACK_TYPE.LX)
          ) {
            // LX group 은 LX 값 포함 또는 1,2
            // pltNum 은 로봇위의 파레트 그릴때 사용
            child = this.getChildrenByOne(rack, RACK_TYPE.LX);
            childCount = this.getChildrenByOne(child, RACK_INNER.COUNT);
            childCount.setAttr('text', data.pltCnt);
          } else if (
            data.lineNumber?.includes(RACK_TYPE.TM) ||
            data.lineNumber === '3' ||
            data.lineNumber === '4' ||
            data.lineNumber === '5' ||
            data.lineNumber === '6' ||
            data.pltNum.toString().includes(RACK_TYPE.TM)
          ) {
            // TM group 은 TM 값 포함 또는 3,4,5,6
            // pltNum 은 로봇위의 파레트 그릴때 사용
            child = this.getChildrenByOne(rack, RACK_TYPE.TM);
            childCount = this.getChildrenByOne(child, RACK_INNER.COUNT);
            childCount.setAttr('text', data.pltCnt);
          } else {
            // R 그룹
            child = this.getChildrenByOne(rack, RACK_TYPE.NONE);
          }
        }
      }
      child.setAttr('visible', true);
    }
  }

  chargePoint(data, group: Konva.Group) {
    const rectGroup = new Konva.Group({
      x: data.x,
      y: data.y,
      offset: {
        x: 25,
        y: 25,
      },
      scale: { x: GROUP_SCALE.RACK_GROUP, y: GROUP_SCALE.RACK_GROUP },
    });

    const rect = new Konva.Rect({
      width: OBJECT_SIZE.OUTER,
      height: OBJECT_SIZE.OUTER,
      fill: '#FFD966',
      stroke: 'black',
      strokeWidth: 1,
      cornerRadius: 7,
    });
    rectGroup.add(rect);

    const img = new Image();
    img.onload = () => {
      const charge = new Konva.Image({
        x: rect.width() / 2,
        y: rect.height() / 2,
        image: img,
        scale: { x: 2, y: 2 },
        offset: {
          x: img.width / 2,
          y: img.height / 2,
        },
      });
      rectGroup.add(charge);
    };
    img.src = chargeUrl;

    group.add(rectGroup);
  }

  pathPoint(data, group: Konva.Group) {
    const circle = new Konva.Circle({
      x: data.x,
      y: data.y,
      radius: 17,
      fill: '#00B0F0',
      name: data.name,
    });
    group.add(circle);
  }

  getLinePoint(line): number[] {
    const { fromNodeId, toNodeId } = line;
    const list = this.points;

    const points: number[] = [
      list[fromNodeId]?.x ?? 0,
      list[fromNodeId]?.y ?? 0,
      list[toNodeId]?.x ?? 0,
      list[toNodeId]?.y ?? 0,
    ];

    return points;
  }

  wheel(e: WheelEvent): void {
    if (this.stage != null) {
      const scaleBy = 1.15;
      const oldScale = this.stage.scaleX();

      const pointer: Konva.Vector2d = this.stage.getPointerPosition() as Konva.Vector2d;
      const mousePointTo = {
        x: (pointer.x - this.stage.x()) / oldScale,
        y: (pointer.y - this.stage.y()) / oldScale,
      };

      let direction = e.deltaY > 0 ? -1 : 1;

      if (e.ctrlKey) {
        direction = -direction;
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      this.stage.setAttrs({
        scaleX: newScale,
        scaleY: newScale,
      });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      this.stage.position(newPos);
    }
  }

  resizeStage(width: number, height: number) {
    if (this.stage) {
      this.stage.setAttrs({
        width: width,
        height: height,
      });
    }
  }

  removeStage() {
    if (this.stage) {
      this.stage.destroy();
      this.stage = undefined;
      this.mapLayer = undefined;
      this.points = {};
      this.robots = {};
      this.rackShape = {};
      this.robotOrder = {};
      this.robotName = {};
      this.orderNumber = {};
      this.intervalCheck = undefined;
      this._emit = undefined;
      this.mapId = '';
      this.width = 0;
      this.height = 0;
    }
  }
}

export default MapManager;
