<template>
  <div class="console">
    <!--数据卡片-->
    <!-- <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item>
        <NCard
          title="访问量"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra>
            <n-tag type="success">日</n-tag>
          </template>
          <div class="flex justify-between px-1 py-1">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <CountTo v-else :startVal="1" :endVal="visits.dayVisits" class="text-3xl" />
          </div>
          <div class="flex justify-between px-1 py-1">
            <div class="text-sn">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                日同比
                <CountTo :startVal="1" suffix="%" :endVal="visits.rise" />
                <n-icon size="12" color="#00ff6f">
                  <CaretUpOutlined />
                </n-icon>
              </template>
            </div>
            <div class="text-sn">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                周同比
                <CountTo :startVal="1" suffix="%" :endVal="visits.decline" />
                <n-icon size="12" color="#ffde66">
                  <CaretDownOutlined />
                </n-icon>
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" text :repeat="2" />
              <template v-else>
                <div class="text-sn"> 总访问量： </div>
                <div class="text-sn">
                  <CountTo :startVal="1" :endVal="visits.amount" />
                </div>
              </template>
            </div>
          </template>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="销售额"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra>
            <n-tag type="info">周</n-tag>
          </template>
          <div class="flex justify-between px-1 py-1">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <CountTo
              v-else
              prefix="￥"
              :startVal="1"
              :endVal="saleroom.weekSaleroom"
              class="text-3xl"
            />
          </div>
          <div class="flex justify-between px-2 py-2">
            <div class="flex-1 text-sn">
              <n-progress
                type="line"
                :percentage="saleroom.degree"
                :indicator-placement="'inside'"
                processing
              />
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div class="text-sn"> 总销售额： </div>
                <div class="text-sn">
                  <CountTo prefix="￥" :startVal="1" :endVal="saleroom.amount" />
                </div>
              </template>
            </div>
          </template>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="订单量"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra>
            <n-tag type="warning">周</n-tag>
          </template>
          <div class="flex justify-between px-1 py-1">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <CountTo v-else :startVal="1" :endVal="orderLarge.weekLarge" class="text-3xl" />
          </div>
          <div class="flex justify-between px-1 py-1">
            <div class="text-sn">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                日同比
                <CountTo :startVal="1" suffix="%" :endVal="orderLarge.rise" />
                <n-icon size="12" color="#00ff6f">
                  <CaretUpOutlined />
                </n-icon>
              </template>
            </div>
            <div class="text-sn">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                周同比
                <CountTo :startVal="1" suffix="%" :endVal="orderLarge.rise" />
                <n-icon size="12" color="#ffde66">
                  <CaretDownOutlined />
                </n-icon>
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div class="text-sn"> 转化率： </div>
                <div class="text-sn">
                  <CountTo :startVal="1" suffix="%" :endVal="orderLarge.amount" />
                </div>
              </template>
            </div>
          </template>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard
          title="成交额"
          :segmented="{ content: true, footer: true }"
          size="small"
          :bordered="false"
        >
          <template #header-extra>
            <n-tag type="error">月</n-tag>
          </template>
          <div class="flex justify-between px-1 py-1">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <CountTo v-else prefix="￥" :startVal="1" :endVal="volume.weekLarge" class="text-3xl" />
          </div>
          <div class="flex justify-between px-1 py-1">
            <div class="text-sn">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <CountTo :startVal="1" suffix="%" :endVal="volume.rise" />
                <n-icon size="12" color="#00ff6f">
                  <CaretUpOutlined />
                </n-icon>
              </template>
            </div>
            <div class="text-sn">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                月同比
                <CountTo :startVal="1" suffix="%" :endVal="volume.decline" />
                <n-icon size="12" color="#ffde66">
                  <CaretDownOutlined />
                </n-icon>
              </template>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <n-skeleton v-if="loading" :width="100" size="medium" />
              <template v-else>
                <div class="text-sn"> 总成交额： </div>
                <div class="text-sn">
                  <CountTo prefix="￥" :startVal="1" :endVal="volume.amount" />
                </div>
              </template>
            </div>
          </template>
        </NCard>
      </n-grid-item>
    </n-grid> -->

    <n-card :bordered="false" class="mt-3">
      <BasicTable
        :columns="columns"
        :actionColumn="actionColumn"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        @update:checked-row-keys="onCheckedRow"
        :scroll-x="1090"
        :striped="true"
      >
        <template #tableTitle>
          <n-button type="primary" @click="addTable">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建
          </n-button>
        </template>

        <template #toolbar> </template>
      </BasicTable>

      <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="title">
        <n-form
          :model="formParams"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="100"
          class="py-4"
        >
          <n-form-item label="名称" path="name">
            <n-input placeholder="请输入名称" v-model:value="formParams.name" />
          </n-form-item>
          <n-form-item label="二级路由" path="option">
            <n-input
              type="textarea"
              placeholder="请输入二级路由"
              v-model:value="formParams.option"
            />
          </n-form-item>
          <n-form-item label="开启状态" path="status">
            <n-switch v-model:value="formParams.status" />
          </n-form-item>
        </n-form>

        <template #action>
          <n-space>
            <n-button @click="() => (showModal = false)">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
          </n-space>
        </template>
      </n-modal>
    </n-card>
  </div>
</template>
<script lang="ts" setup>
  import { ref, Ref, h, reactive, onMounted } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getList, editCatalogue, addCatalogue, deleteCatalogue } from '@/api/dashboard/console';
  import { CountTo } from '@/components/CountTo/index';
  import { useRouter } from 'vue-router';
  import { BasicColumn } from '@/components/Table';
  import { NSwitch, useDialog, useMessage, type FormRules } from 'naive-ui';

  const dialog = useDialog();
  const message = useMessage();

  const rules: FormRules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称',
    },
    option: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入二级路由',
    },
  };

  const statusMap = {
    0: false,
    1: true,
  };

  interface ListData {
    id: number;
    name: string;
    sex: string;
    avatar: string;
    email: string;
    city: string;
    status: number;
    type: string;
    createDate: string;
  }

  interface InVisits {
    dayVisits: number;
    rise: number;
    decline: number;
    amount: number;
  }

  interface InSaleroom {
    weekSaleroom: number;
    amount: number;
    degree: number;
  }

  interface InOrderLarge {
    weekLarge: number;
    rise: number;
    decline: number;
    amount: number;
  }

  interface InVolume {
    weekLarge: number;
    rise: number;
    decline: number;
    amount: number;
  }

  interface typeResult {
    code: number;
    msg: string;
  }

  const router = useRouter();
  const actionRef = ref();
  const formRef: any = ref(null);
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  let formParams = reactive({
    name: '',
    option: '',
    status: 0,
  });
  let title: Ref<string> = ref('新建');

  const actionColumn = reactive({
    width: 150,
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => true,
            auth: ['basic_list'],
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
            ifShow: () => true,
            auth: ['basic_list'],
          },
        ],
        select: (key) => {
          window['$message'].info(`您点击了，${key} 按钮`);
        },
      });
    },
  });

  function handleEdit(record) {
    title.value = '编辑';
    showModal.value = true;
    formParams = record;
  }

  function handleDelete(record) {
    dialog.warning({
      title: '警告',
      content: '确定删除吗？',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick: async () => {
        const res: typeResult = await (deleteCatalogue({ id: record.id }) as Promise<typeResult>);
        if (res.code === 200) {
          window['$message'].success(res.msg);
          reloadTable();
        } else {
          window['$message'].error(res.msg);
        }
      },
      onNegativeClick: () => {},
    });
  }

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  const loadDataTable = async (res: any) => {
    let _params = {
      ...res,
    };

    const list = await getList(_params);
    return list;
  };

  // 更新状态的逻辑
  const updateStatus = async (row, value) => {
    // 这里可以执行异步请求或其他逻辑
    row.status = value;
    const params = {
      id: row.id,
      status: value ? 1 : 0,
    };
    const res: typeResult = await (editCatalogue(params) as Promise<typeResult>);
    message.success(res.msg);
  };

  function addTable() {
    title.value = '新建';
    Object.assign(formParams, {
      name: '',
      option: '',
      status: 0,
    });
    showModal.value = true;
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (title === '新建') {
          const res: typeResult = await (addCatalogue(formParams) as Promise<typeResult>);
          if (res.code === 200) {
            window['$message'].success(res.msg);
            setTimeout(() => {
              showModal.value = false;
              reloadTable();
            });
          } else {
            window['$message'].error(res.msg);
          }
        } else {
          const res: typeResult = await (editCatalogue(formParams) as Promise<typeResult>);
          if (res.code === 200) {
            window['$message'].success(res.msg);
            setTimeout(() => {
              showModal.value = false;
              reloadTable();
            });
          } else {
            window['$message'].error(res.msg);
          }
        }
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  const columns: BasicColumn<ListData>[] = [
    {
      title: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      key: 'name',
      width: 250,
    },
    {
      title: '二级路由',
      key: 'option',
      // width: 220,
    },
    {
      title: '状态',
      key: 'status',
      width: 150,
      render(record) {
        return h(NSwitch, {
          value: statusMap[record.status],
          onUpdateValue: (value) => updateStatus(record, value),
        });
      },
    },
  ];

  const loading = ref(true);
  const visits = ref({} as InVisits);
  const saleroom = ref({} as InSaleroom);
  const orderLarge = ref({} as InOrderLarge);
  const volume = ref({} as InVolume);

  onMounted(async () => {
    // const data = await getList();
    // visits.value = data.visits;
    // saleroom.value = data.saleroom;
    // orderLarge.value = data.orderLarge;
    // volume.value = data.volume;
    loading.value = false;
  });
</script>

<style lang="less" scoped></style>
