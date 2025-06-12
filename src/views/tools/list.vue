<template>
  <div class="tools-container">
    <n-card title="工具管理" :bordered="false" size="small">
      <template #header-extra>
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            添加工具
          </n-button>
          <n-button type="info" @click="testModal">测试弹窗</n-button>
        </n-space>
      </template>

      <div class="search-area">
        <n-space>
          <n-input
            v-model="searchForm.name"
            placeholder="工具名称"
            clearable
            style="width: 200px"
          />
          <n-select
            v-model="searchForm.category"
            placeholder="分类"
            clearable
            :options="categoryOptions"
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
        :row-props="() => ({ style: 'height: 100px;' })"
        :scroll-x="1200"
        :single-line="true"
        @update:page="handlePageChange"
      />
    </n-card>

    <!-- 简化的模态框 -->
    <n-modal
      :show="showModal"
      @update:show="(value) => (showModal = value)"
      style="z-index: 9999 !important"
      transform-origin="center"
    >
      <n-card
        style="width: 600px"
        :title="formData.id ? '编辑工具' : '添加工具'"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-placement="left"
          :label-width="100"
        >
          <n-form-item label="工具名称" path="title">
            <n-input
              :value="formData.title"
              @update:value="(val) => (formData.title = val)"
              placeholder="请输入工具名称"
            />
          </n-form-item>
          <n-form-item label="工具描述" path="desc">
            <n-input
              :value="formData.desc"
              @update:value="(val) => (formData.desc = val)"
              type="textarea"
              placeholder="请输入工具描述"
            />
          </n-form-item>
          <n-form-item label="文件大小" path="size">
            <n-input
              :value="formData.size"
              @update:value="(val) => (formData.size = val)"
              placeholder="请输入文件大小，如：38MB"
            />
          </n-form-item>
          <n-form-item label="版本号" path="version">
            <n-input
              :value="formData.version"
              @update:value="(val) => (formData.version = val)"
              placeholder="请输入版本号"
            />
          </n-form-item>
          <n-form-item label="下载链接" path="link">
            <n-input
              :value="formData.link"
              @update:value="(val) => (formData.link = val)"
              placeholder="请输入下载链接"
            />
          </n-form-item>
          <n-form-item label="图标路径" path="iconPath">
            <n-space vertical style="width: 100%">
              <n-input-group>
                <n-input
                  :value="formData.iconPath"
                  @update:value="(val) => (formData.iconPath = val)"
                  placeholder="请输入图标URL或点击右侧按钮上传"
                  clearable
                />
                <n-upload
                  action="http://120.46.28.146:8088/api/upload/image"
                  :headers="{ Authorization: `Bearer ${getToken()}` }"
                  name="image"
                  :show-file-list="false"
                  accept="image/*"
                  @finish="handleIconUploadFinish"
                  @error="handleIconUploadError"
                >
                  <n-button type="primary" ghost style="border-left: 0">
                    <template #icon>
                      <n-icon><CloudUpload /></n-icon>
                    </template>
                    上传
                  </n-button>
                </n-upload>
              </n-input-group>

              <div
                v-if="formData.iconPath"
                style="
                  display: flex;
                  align-items: center;
                  padding: 8px;
                  background: #fafafa;
                  border-radius: 6px;
                  border: 1px solid #e0e0e0;
                "
              >
                <n-image
                  :src="formData.iconPath"
                  alt="图标预览"
                  width="48"
                  height="48"
                  object-fit="cover"
                  style="border-radius: 6px; border: 1px solid #d9d9d9; background: white"
                  fallback-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkFGQUZBIi8+CjxwYXRoIGQ9Ik0yMCAyOEwyMCAxMk0yMCAxMkwxNiAxNk0yMCAxMkwyNCAxNiIgc3Ryb2tlPSIjQzNDM0MzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"
                />
                <div style="margin-left: 12px; flex: 1">
                  <div style="font-size: 14px; color: #333; margin-bottom: 4px">图标预览</div>
                  <div style="font-size: 12px; color: #666; word-break: break-all">{{
                    formData.iconPath
                  }}</div>
                </div>
                <n-button
                  size="small"
                  quaternary
                  type="error"
                  @click="formData.iconPath = ''"
                  style="margin-left: 8px"
                >
                  <template #icon>
                    <n-icon><Close /></n-icon>
                  </template>
                </n-button>
              </div>
            </n-space>
          </n-form-item>
          <n-form-item label="图标类名" path="iconClass">
            <n-select
              :value="formData.iconClass"
              @update:value="(val) => (formData.iconClass = val)"
              :options="iconClassOptions"
              placeholder="请选择图标类名"
              clearable
            />
          </n-form-item>
          <n-form-item label="分类" path="category">
            <n-select
              :value="formData.category"
              @update:value="(val) => (formData.category = val)"
              :options="categoryOptions"
              placeholder="请选择分类"
            />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-switch
              :value="formData.status"
              @update:value="(val) => (formData.status = val)"
              :checked-value="1"
              :unchecked-value="0"
            >
              <template #checked>启用</template>
              <template #unchecked>禁用</template>
            </n-switch>
          </n-form-item>
        </n-form>
        <template #action>
          <div style="display: flex; justify-content: center; background: #fff">
            <n-button style="margin-right: 10px" @click="showModal = false">取消</n-button>
            <n-button type="primary" @click="handleSave">保存</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, h } from 'vue';
  import {
    NCard,
    NButton,
    NIcon,
    NSpace,
    NInput,
    NInputGroup,
    NSelect,
    NDataTable,
    NModal,
    NForm,
    NFormItem,
    NSwitch,
    NUpload,
    NImage,
    NTag,
    useMessage,
    useDialog,
  } from 'naive-ui';
  import { Add, CloudUpload, Close } from '@vicons/ionicons5';
  import { getToolsApi, addToolApi, updateToolApi, deleteToolApi } from '../../api/tools';
  import apiConfig from '../../config/api';

  const message = useMessage();
  const dialog = useDialog();

  const loading = ref(false);
  const showModal = ref(false);
  const dataList = ref([]);
  const formRef = ref();

  const searchForm = reactive({
    name: '',
    category: null,
  });

  const formData = reactive({
    id: null,
    title: '',
    desc: '',
    size: '',
    version: '',
    iconClass: '',
    iconPath: '',
    link: '',
    category: 0,
    status: 1,
  });

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    showSizePicker: true,
  });

  const categoryOptions = [
    { label: '全部/近期更新', value: 0 },
    { label: '实用软件', value: 1 },
    { label: '影视音乐', value: 2 },
    { label: '漫画小说', value: 3 },
  ];

  const iconClassOptions = [
    { label: 'camera', value: 'camera' },
    { label: 'wechat', value: 'wechat' },
    { label: 'music', value: 'music' },
    { label: 'poem', value: 'poem' },
  ];

  const formRules = {
    title: [{ required: true, message: '请输入工具名称', trigger: 'blur' }],
    desc: [{ required: true, message: '请输入工具描述', trigger: 'blur' }],
    link: [{ required: true, message: '请输入下载链接', trigger: 'blur' }],
    category: [
      {
        required: true,
        message: '请选择分类',
        trigger: 'change',
        validator: (rule, value) => {
          if (value === null || value === undefined) {
            return new Error('请选择分类');
          }
          if (typeof value === 'number' && value >= 0) {
            return true;
          }
          return new Error('请选择分类');
        },
      },
    ],
  };

  const columns = [
    { title: 'ID', key: 'id', width: 80, fixed: 'left' },
    {
      title: '图标',
      key: 'iconPath',
      width: 100,
      render: (row) => {
        if (!row.iconPath) {
          return h(
            'div',
            {
              style: {
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                borderRadius: '8px',
                border: '1px dashed #d9d9d9',
                color: '#999',
                fontSize: '12px',
              },
            },
            '无图标'
          );
        }
        return h(NImage, {
          src: row.iconPath,
          alt: row.title || '工具图标',
          width: 80,
          height: 80,
          objectFit: 'cover',
          previewDisabled: false,
          style: {
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            cursor: 'pointer',
          },
          fallbackSrc:
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkFGQUZBIi8+CjxwYXRoIGQ9Ik00MCA1Nkw0MCAyNE00MCAyNEwzMiAzMk00MCAyNEw0OCAzMiIgc3Ryb2tlPSIjQzNDM0MzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K',
        });
      },
    },
    { title: '工具名称', key: 'title', width: 150 },
    { title: '描述', key: 'desc', ellipsis: { tooltip: true } },
    { title: '文件大小', key: 'size', width: 100 },
    { title: '版本', key: 'version', width: 100 },
    {
      title: '分类',
      key: 'category',
      width: 120,
      render: (row) => {
        const category = categoryOptions.find((item) => item.value === row.category);
        return category ? category.label : '未知';
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
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
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (row) => {
        return h(NSpace, null, {
          default: () => [
            h(
              NButton,
              { size: 'small', type: 'info', onClick: () => handleView(row) },
              { default: () => '查看' }
            ),
            h(
              NButton,
              { size: 'small', type: 'primary', onClick: () => handleEdit(row) },
              { default: () => '编辑' }
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

  const getToolsList = async () => {
    try {
      loading.value = true;
      const params: any = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      if (searchForm.name) {
        params.title = searchForm.name;
      }

      if (searchForm.category !== null && searchForm.category !== undefined) {
        params.category = searchForm.category;
      }

      const response = await getToolsApi(params);
      console.log('API响应:', response); // 调试用

      if (response && response.code === 200) {
        dataList.value = Array.isArray(response.data) ? response.data : [];
        pagination.total = response.count || 0;
        console.log('数据列表:', dataList.value, '总数:', pagination.total);
      } else {
        message.error(response?.msg || '获取数据失败');
        console.error('API错误:', response);
      }
    } catch (error) {
      message.error('获取工具列表失败');
      console.error('请求错误:', error);
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = () => {
    pagination.page = 1;
    getToolsList();
  };

  const handleReset = () => {
    searchForm.name = '';
    searchForm.category = null;
    pagination.page = 1;
    getToolsList();
  };

  const handlePageChange = (page: number) => {
    pagination.page = page;
    getToolsList();
  };

  const handleAdd = () => {
    // 重置表单数据
    formData.id = null;
    formData.title = '';
    formData.desc = '';
    formData.size = '';
    formData.version = '';
    formData.iconClass = '';
    formData.iconPath = '';
    formData.link = '';
    formData.category = 0;
    formData.status = 1;

    showModal.value = true;
  };

  const testModal = () => {
    console.log('测试弹窗，当前showModal值:', showModal.value);
    showModal.value = true;
    console.log('设置后showModal值:', showModal.value);
  };

  const testFormData = () => {
    console.log('测试表单数据');
    // 手动设置一些测试数据
    formData.title = '测试工具名称';
    formData.desc = '这是一个测试描述';
    formData.size = '10MB';
    formData.version = 'v1.0.0';
    formData.link = 'https://test.com';
    formData.category = 1;
    formData.status = 1;

    console.log('设置后的formData:', formData);
    showModal.value = true;
  };

  // 获取Token函数
  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  // 处理图标上传成功
  const handleIconUploadFinish = ({ file, event }) => {
    try {
      const response = JSON.parse(event.target.response);
      console.log('上传响应:', response);

      if (response.code === 200) {
        // 直接赋值并强制触发响应式更新
        formData.iconPath = response.data.url;

        // 添加延时确保UI更新
        setTimeout(() => {
          console.log('图标路径已更新:', formData.iconPath);
          console.log('当前formData:', JSON.stringify(formData));
        }, 100);

        message.success('图标上传成功');
      } else {
        message.error(response.msg || '上传失败');
      }
    } catch (error) {
      console.error('解析上传响应失败:', error);
      message.error('上传失败，请检查网络连接');
    }
  };

  // 处理图标上传错误
  const handleIconUploadError = ({ file, event }) => {
    console.error('图标上传失败:', event);
    message.error('图标上传失败，请重试');
  };

  const handleEdit = (row) => {
    console.log('编辑工具:', row);
    console.log('编辑前showModal值:', showModal.value);

    // 逐个赋值以保持响应式
    formData.id = row.id;
    formData.title = row.title || '';
    formData.desc = row.desc || '';
    formData.size = row.size || '';
    formData.version = row.version || '';
    formData.iconClass = row.iconClass || '';
    formData.iconPath = row.iconPath || '';
    formData.link = row.link || '';
    formData.category = row.category || 0;
    formData.status = row.status || 1;

    showModal.value = true;
    console.log('编辑后showModal值:', showModal.value);
    console.log('表单数据:', formData);
  };

  const handleView = (row) => {
    dialog.info({
      title: '工具详情',
      content: `名称: ${row.title}\n描述: ${row.desc}\n大小: ${row.size}\n版本: ${row.version}\n链接: ${row.link}`,
      positiveText: '确定',
    });
  };

  const handleDelete = (row) => {
    dialog.warning({
      title: '确认删除',
      content: `确定要删除工具 "${row.title}" 吗？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const response = await deleteToolApi(row.id);
          if (response && response.code === 200) {
            message.success('删除成功');
            getToolsList();
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

  const handleSave = async () => {
    try {
      await formRef.value?.validate();

      console.log('保存数据:', formData);
      const isEdit = !!formData.id;
      console.log('操作类型:', isEdit ? '编辑' : '新增');

      const response = isEdit ? await updateToolApi(formData) : await addToolApi(formData);
      console.log('API响应:', response);

      if (response && response.code === 200) {
        message.success(isEdit ? '更新成功' : '添加成功');
        showModal.value = false;
        getToolsList();
      } else {
        message.error(response?.msg || '保存失败');
        console.error('保存失败，API返回:', response);
      }
    } catch (error) {
      message.error('保存失败');
      console.error('保存错误:', error);
    }
  };

  onMounted(() => {
    getToolsList();
  });
</script>

<style scoped>
  .tools-container {
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
