<!--<template>-->
<!--  <label>Image File:</label><br />-->
<!--  <input type="file" id="imageLoader" name="imageLoader" />-->
<!--  <canvas id="imageCanvas"></canvas>-->
<!--</template>-->
<!--<script>-->
<!--  window.onload = function () {-->
<!--    let imageLoader = document.getElementById('imageLoader');-->
<!--    imageLoader.addEventListener('change', handleImage, false);-->
<!--    let canvas = document.getElementById('imageCanvas');-->
<!--    let ctx = canvas.getContext('2d');-->
<!--    function handleImage(e) {-->
<!--      let reader = new FileReader();-->
<!--      reader.onload = function (event) {-->
<!--        let img = new Image();-->
<!--        img.onload = function () {-->
<!--          canvas.width = img.width;-->
<!--          canvas.height = img.height;-->
<!--          ctx.drawImage(img, 0, 0);-->
<!--        };-->
<!--        img.src = event.target.result;-->
<!--      };-->
<!--      reader.readAsDataURL(e.target.files[0]);-->
<!--    }-->
<!--  };-->
<!--</script>-->
<template>
  <div>
    <input type="file" id="file_input" />
  </div>
  <div
    id="canvas-container"
    style="display: inline-block; border: 1px solid #ccc; background-color: #ccc; overflow: auto"
  ></div>
</template>

<script lang="ts" setup>
  import Konva from 'konva';

  let stage = new Konva.Stage({
    width: 650,
    height: 300,
  });

  let layer = new Konva.Layer();
  stage.add(layer);
  stage.draw();

  window.onload = function () {
    let imageLoader = document.getElementById('file_input');
    if (imageLoader) {
      imageLoader.addEventListener('change', handleImage, false);
      function handleImage(e) {
        let URL = window.webkitURL || window.URL;
        let url = URL.createObjectURL(e.target.files[0]);
        let img = new Image();
        img.src = url;

        img.onload = function () {
          let img_width = img.width;
          let img_height = img.height;

          // calculate dimensions to get max 300px
          let max = 300;
          let ratio = img_width > img_height ? img_width / max : img_height / max;

          // now load the Konva image
          let theImg = new Konva.Image({
            image: img,
            x: 50,
            y: 30,
            width: img_width / ratio,
            height: img_height / ratio,
            draggable: true,
            rotation: 20,
          });

          layer.add(theImg);
          layer.draw();
        };
      }
    }
  };

  // listen for the file input change event and load the image.
</script>
