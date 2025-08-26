<template>
  <div class="category-container">
    <n-card title="分类管理" :bordered="false" size="small">
      <template #header-extra>
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <Add />
            </n-icon>
          </template>
          添加分类
        </n-button>
      </template>

      <div class="search-area">
        <n-space>
          <n-input
            v-model="searchForm.name"
            placeholder="分类名称"
            clearable
            style="width: 200px"
          />
          <n-select
            v-model="searchForm.status"
            placeholder="状态"
            clearable
            :options="statusOptions"
            style="width: 150px"
          />
          <n-button type="primary" @click="handleSearch">搜索</n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </div>

      <n-data-table
        :columns="columns"
        :data="dataList"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        :scroll-x="1200"
        @update:page="handlePageChange"
      />
    </n-card>

    <!-- 编辑/添加模态框 -->
    <n-modal v-model:show="showModal" style="z-index: 9999 !important" transform-origin="center">
      <n-card
        style="width: 500px"
        :title="formData.id ? '编辑分类' : '添加分类'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="formRef"
          :model="tempFormData"
          :rules="formRules"
          label-placement="left"
          :label-width="100"
        >
          <n-form-item label="分类名称" path="name">
            <n-input
              :value="tempFormData.name"
              @update:value="(val) => (tempFormData.name = val)"
              placeholder="请输入分类名称"
              autocomplete="off"
            />
          </n-form-item>
          <n-form-item label="排序顺序" path="sort_order">
            <n-input-number
              :value="tempFormData.sort_order"
              @update:value="(val) => (tempFormData.sort_order = val)"
              :min="0"
              :max="999"
              placeholder="数字越小越靠前"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-switch
              :value="tempFormData.status"
              @update:value="(val) => (tempFormData.status = val)"
              :checked-value="1"
              :unchecked-value="0"
            >
              <template #checked>启用</template>
              <template #unchecked>禁用</template>
            </n-switch>
          </n-form-item>

          <!-- 添加测试按钮 -->
          <div style="margin-top: 16px; text-align: center">
            <n-button type="info" @click="testFormInput">测试输入值</n-button>
          </div>
        </n-form>
        <template #action>
          <div style="display: flex; justify-content: center; background: #fff">
            <n-button style="margin-right: 10px" @click="handleModalClose">取消</n-button>
            <n-button type="primary" @click="handleSave">保存</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, h, nextTick } from 'vue';
  import {
    NCard,
    NButton,
    NIcon,
    NSpace,
    NInput,
    NInputNumber,
    NSelect,
    NDataTable,
    NModal,
    NForm,
    NFormItem,
    NSwitch,
    NTag,
    useMessage,
    useDialog,
  } from 'naive-ui';
  import { Add } from '@vicons/ionicons5';
  import {
    getCategoriesApi,
    addCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
    updateCategoryStatusApi,
  } from '../../api/categories';

  const message = useMessage();
  const dialog = useDialog();

  // 状态和数据
  const loading = ref(false);
  const showModal = ref(false);
  const dataList = ref([]);
  const formRef = ref();

  // 搜索表单
  const searchForm = reactive({
    name: '',
    status: null,
  });

  // 表单数据
  const formData = reactive({
    id: null,
    name: '',
    sort_order: 0,
    status: 1,
  });

  // 临时表单数据，用于处理编辑时的值
  const tempFormData = reactive({
    id: null,
    name: '',
    sort_order: 0,
    status: 1,
  });

  // 分页配置
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    showSizePicker: true,
    pageSlot: 5,
    pageSizes: [10, 20, 30, 40],
  });

  // 状态选项
  const statusOptions = [
    { label: '启用', value: 1 },
    { label: '禁用', value: 0 },
  ];

  // 表单验证规则
  const formRules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    sort_order: [{ type: 'number', message: '请输入有效的排序数字', trigger: 'blur' }],
  };

  // 表格列配置
  const columns = [
    { title: 'ID', key: 'id', width: 80, fixed: 'left' },
    { title: '分类名称', key: 'name', width: 200 },
    { title: '排序顺序', key: 'sort_order', width: 100 },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (row) => {
        return h(
          NTag,
          {
            type: row.status === 1 ? 'success' : 'default',
            size: 'small',
            round: true,
          },
          {
            default: () => (row.status === 1 ? '启用' : '禁用'),
          }
        );
      },
    },
    { title: '创建时间', key: 'createTime', width: 180 },
    { title: '更新时间', key: 'updateTime', width: 180 },
    {
      title: '操作',
      key: 'actions',
      width: 250,
      fixed: 'right',
      render: (row) => {
        return h(NSpace, null, {
          default: () => [
            h(
              NButton,
              { size: 'small', type: 'primary', onClick: () => handleEdit(row) },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: row.status === 1 ? 'warning' : 'success',
                onClick: () => handleToggleStatus(row),
              },
              { default: () => (row.status === 1 ? '禁用' : '启用') }
            ),
            h(
              NButton,
              { size: 'small', type: 'error', onClick: () => handleDelete(row) },
              { default: () => '删除' }
            ),
          ],
        });
      },
    },
  ];

  // 获取分类列表
  const getCategoryList = async () => {
    try {
      loading.value = true;
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        // 添加时间戳参数，防止缓存
        _timestamp: new Date().getTime(),
      };

      if (searchForm.name) {
        params.name = searchForm.name;
      }

      if (searchForm.status !== null) {
        params.status = searchForm.status;
      }

      const response = await getCategoriesApi(params);

      if (response && response.code === 200) {
        // 强制Vue重新渲染数组，避免引用相同导致视图不更新
        dataList.value = Array.isArray(response.data) ? [...response.data] : [];
        pagination.total = response.count || 0;
      } else {
        message.error(response?.msg || '获取数据失败');
      }
    } catch (error) {
      message.error('获取分类列表失败');
      console.error('请求错误:', error);
    } finally {
      loading.value = false;
    }
  };

  // 处理搜索
  const handleSearch = () => {
    pagination.page = 1;
    getCategoryList();
  };

  // 处理重置
  const handleReset = () => {
    searchForm.name = '';
    searchForm.status = null;
    pagination.page = 1;
    getCategoryList();
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    pagination.page = page;
    getCategoryList();
  };

  // 处理添加
  const handleAdd = () => {
    // 重置表单数据
    formData.id = null;
    formData.name = '';
    formData.sort_order = 0;
    formData.status = 1;

    showModal.value = true;
  };

  // 处理编辑
  const handleEdit = (row) => {
    console.log('开始编辑行数据:', JSON.stringify(row));

    // 重置临时表单数据
    tempFormData.id = null;
    tempFormData.name = '';
    tempFormData.sort_order = 0;
    tempFormData.status = 1;

    // 设置主表单数据(formData)
    formData.id = row.id;
    formData.name = row.name;
    formData.sort_order = row.sort_order;
    formData.status = row.status;

    // 使用nextTick确保DOM更新后再设置临时表单数据
    nextTick(() => {
      // 设置临时表单数据
      tempFormData.id = row.id;
      tempFormData.name = row.name;
      tempFormData.sort_order = row.sort_order;
      tempFormData.status = row.status;

      console.log('设置后的临时表单数据:', JSON.stringify(tempFormData));
      console.log('设置后的主表单数据:', JSON.stringify(formData));
    });

    // 显示模态框
    showModal.value = true;
  };

  // 在模态框关闭时同步数据
  const handleModalClose = () => {
    console.log('模态框关闭，取消编辑');
    showModal.value = false;
  };

  // 处理切换状态
  const handleToggleStatus = (row) => {
    const newStatus = row.status === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? '启用' : '禁用';

    dialog.warning({
      title: `确认${statusText}分类`,
      content: `确定要${statusText}分类 "${row.name}" 吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const response = await updateCategoryStatusApi(row.id, newStatus);
          if (response && response.code === 200) {
            message.success(`${statusText}成功`);
            getCategoryList(); // 刷新列表
          } else {
            message.error(response?.msg || `${statusText}失败`);
          }
        } catch (error) {
          message.error(`${statusText}失败`);
          console.error('操作错误:', error);
        }
      },
    });
  };

  // 处理删除
  const handleDelete = (row) => {
    dialog.warning({
      title: '确认删除',
      content: `确定要删除分类 "${row.name}" 吗？此操作不可撤销，且如果该分类下有关联的商品，将无法删除。`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const response = await deleteCategoryApi(row.id);
          if (response && response.code === 200) {
            message.success('删除成功');
            getCategoryList(); // 刷新列表
          } else {
            message.error(response?.msg || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
          console.error('删除错误:', error);
        }
      },
    });
  };

  // 处理保存
  const handleSave = async () => {
    try {
      await formRef.value?.validate();

      // 从临时表单数据同步到主表单数据
      formData.name = tempFormData.name;
      formData.sort_order = tempFormData.sort_order;
      formData.status = tempFormData.status;

      console.log('保存前的表单数据:', JSON.stringify(formData));

      const isEdit = !!formData.id;

      // 准备API请求数据
      const apiData = isEdit
        ? { ...formData }
        : {
            name: formData.name,
            sort_order: formData.sort_order,
            status: formData.status,
          };

      console.log('发送到API的数据:', JSON.stringify(apiData));

      // 发送请求
      const response = isEdit ? await updateCategoryApi(apiData) : await addCategoryApi(apiData);

      console.log('API响应:', response);

      if (response && response.code === 200) {
        message.success(isEdit ? '更新成功' : '添加成功');
        showModal.value = false;

        // 如果是编辑，先更新本地数据
        if (isEdit) {
          const index = dataList.value.findIndex((item) => item.id === formData.id);
          if (index !== -1) {
            // 创建新对象
            const updatedItem = {
              ...dataList.value[index],
              name: formData.name,
              sort_order: formData.sort_order,
              status: formData.status,
              updateTime: new Date().toISOString().replace('T', ' ').split('.')[0],
            };

            // 使用splice替换，确保触发Vue的响应式更新
            dataList.value.splice(index, 1, updatedItem);
            console.log('更新后的本地数据项:', JSON.stringify(dataList.value[index]));
          }
        }

        // 从服务器获取最新数据
        await getCategoryList();
      } else {
        message.error(response?.msg || '保存失败');
      }
    } catch (error) {
      console.error('保存错误:', error);
      if (error?.message) {
        message.error(error.message);
      }
    }
  };

  // 测试按钮函数
  const testFormInput = () => {
    console.log('当前主表单数据(formData):', JSON.stringify(formData));
    console.log('当前临时表单数据(tempFormData):', JSON.stringify(tempFormData));
    console.log('表单控件的实际值可能需要通过DOM获取');
  };

  onMounted(() => {
    getCategoryList();
  });
</script>

<style scoped>
  .category-container {
    padding: 16px;
  }

  .search-area {
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 6px;
  }

  :deep(.n-card__action) {
    background: #fff !important;
  }
</style>
