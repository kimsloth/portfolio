<template>
  <BasicModal v-bind="$attrs" @register="register" :title="state.ui?.title" @ok="okClick">
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import * as mainApi from '/@/api/user';
  import { PageMode } from '/@/enums/projectEnum';

  export interface ModalStatus {
    mode: PageMode;
    id?: number;
    ui?: {
      title: string;
    };
  }

  export default defineComponent({
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const state = reactive<ModalStatus>({
        mode: PageMode.VIEW,
        id: -1,
        ui: {
          title: 'User',
        },
      });

      const schemas: FormSchema[] = [
        {
          field: 'userId',
          component: 'Input',
          label: 'Id',
          colProps: {
            span: 24,
          },
          required: true,
        },
        {
          field: 'userPw',
          component: 'InputPassword',
          label: 'PassWord',
          colProps: {
            span: 24,
          },
          required: true,
          ifShow: () => state.mode === PageMode.CREATE,
        },
        {
          field: 'userGrpId',
          component: 'ApiSelect',
          label: 'group',
          colProps: {
            span: 24,
          },
          componentProps: {
            api: mainApi.getUserGroupList,
            labelField: 'name',
            valueField: 'id',
          },
          required: true,
          defaultValue: 2,
        },
        {
          field: 'name',
          component: 'Input',
          label: 'Name',
          colProps: {
            span: 24,
          },
          required: true,
        },
        {
          field: 'remark',
          component: 'Input',
          label: 'Remark',
          colProps: {
            span: 24,
          },
          defaultValue: '',
        },
      ];

      const [registerForm, { setFieldsValue, resetFields, getFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      const [register, { setModalProps, closeModal }] = useModalInner((data) => {
        Object.keys(state).forEach((key) => {
          if (key in state) state[key] = data[key];
        });
        data && onDataReceive();
      });

      async function onDataReceive() {
        if (state.mode === PageMode.CREATE) {
          await resetFields();
        } else {
          let result = await mainApi.getUserInfo(state.id);
          await setFieldsValue(result);
        }
      }

      async function okClick() {
        try {
          await validate();
          setModalProps({ confirmLoading: true });
          let value = getFieldsValue();
          let target = {
            id: state.id,
            userId: value.id,
            userPw: value.password,
            name: value.name,
            userGrpId: value.group,
            remark: value.remark,
          };
          let data;
          if (state.mode === PageMode.CREATE) {
            data = await mainApi.signUp(target);
          } else if (state.id) {
            data = await mainApi.updateUserInfo(state.id, target);
          }
          if (data) {
            closeModal();
            emit('success');
          }
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { register, registerForm, okClick, state };
    },
  });
</script>
