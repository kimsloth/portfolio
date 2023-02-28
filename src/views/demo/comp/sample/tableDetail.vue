<template>
  <PageWrapper
    :title="'userDetail' + userId"
    content="user detail edit"
    contentBackground
    @back="goBack"
  >
    <template #extra>
      <!--      <a-button type="primary" danger> 삭제 </a-button>-->
      <!--      <a-button type="primary"> 수정 </a-button>-->
    </template>
    <template #footer>
      <Tabs v-model:activeKey="currentKey">
        <TabPane key="detail" tab="userDetail1" />
        <TabPane key="logs" tab="userDetail2" />
      </Tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'detail'">
        <div> </div>
      </template>
      <template v-if="currentKey == 'logs'">
        <div> </div>
      </template>
    </div>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  export default defineComponent({
    name: 'AccountDetail',
    components: { PageWrapper, Tabs, TabPane },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const userId = ref(route.params?.id);
      const currentKey = ref('logs');

      function goBack() {
        router.go(-1);
      }
      return { userId, currentKey, goBack };
    },
  });
</script>

<style></style>
