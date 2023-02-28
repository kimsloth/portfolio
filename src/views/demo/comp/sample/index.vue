<!--
<template>
  <div>
    <BasicTable @register="registerTable">
      <template #userAction="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="addUser">
          {{ t('common.add') + t('common.user') }}
        </a-button>
      </template>
    </BasicTable>
    <Modal @register="registerUserModal" @success="modalSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import {
    BasicTable,
    TableAction,
    useTable,
    EditRecordRow,
    ActionItem,
  } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useGo } from '/@/hooks/web/usePage';
  import { PageMode } from '/@/enums/projectEnum';
  import * as msg from '/@/utils/msg';
  import Modal from './tableModal.vue';
  import { ModalStatus } from '/@/views/setting/user/userInfoModal.vue';
  import * as userApi from '/@/api/user';
  import { columns, searchFormSchema } from './tableData';

  const go = useGo();
  const { t } = useI18n();

  const [registerTable, { reload }] = useTable({
    title: 'List',
    columns,
    rowKey: 'id',
    api: userApi.getUserList,
    bordered: true,
    useSearchForm: true,
    formConfig: {
      labelWidth: '30%',
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    actionColumn: {
      width: 200,
      title: 'Action',
      slots: { customRender: 'userAction' },
    },
  });

  function createActions(record: EditRecordRow): ActionItem[] {
    return [
      {
        icon: 'clarity:note-edit-line',
        tooltip: t('common.modify'),
        onClick: modifyUser.bind(null, record),
      },
      {
        icon: 'ant-design:delete-outlined',
        tooltip: t('common.delete'),
        onClick: msg.confirm.bind(null, t('message.askDelete'), deleteUser, record),
      },
      {
        icon: 'clarity:info-standard-line',
        tooltip: t('common.detail'),
        onClick: goDetailView.bind(null, record),
      },
    ];
  }

  const [registerUserModal, { openModal }] = useModal();

  function goDetailView(record: Recordable) {
    go('/setting/user/' + record.id);
  }

  function modalSuccess() {
    msg.successMsg(t('common.user') + t('common.save'));
    reload();
  }

  function createUserModal(data: ModalStatus) {
    openModal<ModalStatus>(true, {
      ui: {
        title: 'Sample',
      },
      ...data,
    });
  }

  function addUser() {
    createUserModal({ mode: PageMode.CREATE });
  }

  function modifyUser(record) {
    createUserModal({ mode: PageMode.MODIFY, id: record.id });
  }

  async function deleteUser({ id }) {
    let data = await userApi.deleteUserInfo(id);
    if (data) {
      msg.successMsg(t('common.user') + t('common.delete'));
      await reload();
    }
  }
</script>
-->
