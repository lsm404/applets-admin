<!--
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-12 11:40:25
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-08-26 10:40:24
 * @FilePath: /applet-admin/src/views/tools/list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="tools-container">
    <n-card title="商品管理" :bordered="false" size="small">
      <template #header-extra>
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            添加商品
          </n-button>
        </n-space>
      </template>

      <div class="search-area">
        <n-space>
          <n-input
            v-model="searchForm.name"
            placeholder="商品名称"
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
        remote
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
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
        :title="formData.id ? '编辑商品' : '添加商品'"
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
          <n-form-item label="商品名称" path="title">
            <n-input
              :value="formData.title"
              @update:value="(val) => (formData.title = val)"
              placeholder="请输入商品名称"
            />
          </n-form-item>
          <n-form-item label="描述" path="desc">
            <n-input
              :value="formData.desc"
              @update:value="(val) => (formData.desc = val)"
              type="textarea"
              placeholder="请输入商品描述"
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
                  :action="config.utils.getUploadUrl()"
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
          <n-form-item label="轮播图片" path="images">
            <n-space vertical style="width: 100%">
              <div style="display: flex; align-items: center; margin-bottom: 8px">
                <span style="color: #666; font-size: 12px; margin-right: 12px"
                  >支持多选上传（最多5张），用于轮播展示</span
                >
                <n-upload
                  :action="config.utils.getUploadUrl() + 's'"
                  :headers="{ Authorization: `Bearer ${getToken()}` }"
                  name="images"
                  multiple
                  :max="5"
                  :show-file-list="false"
                  accept="image/*"
                  @finish="handleCarouselImageUploadFinish"
                  @error="handleCarouselImageUploadError"
                >
                  <n-button type="primary" size="small" secondary>
                    <template #icon>
                      <n-icon><CloudUpload /></n-icon>
                    </template>
                    添加图片
                  </n-button>
                </n-upload>
              </div>

              <!-- 轮播图片列表 -->
              <div
                v-if="formData.images && formData.images.length > 0"
                style="
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                  gap: 12px;
                  padding: 12px;
                  border: 1px solid #e0e0e0;
                  border-radius: 6px;
                  background: #fafafa;
                "
              >
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  style="
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #d9d9d9;
                  "
                >
                  <n-image
                    :src="image"
                    :alt="`轮播图片${index + 1}`"
                    width="80"
                    height="80"
                    object-fit="cover"
                    style="border-radius: 4px"
                    fallback-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkFGQUZBIi8+CjxwYXRoIGQ9Ik00MCA1Nkw0MCAyNE00MCAyNEwzMiAzMk00MCAyNEw0OCAzMiIgc3Ryb2tlPSIjQzNDM0MzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"
                  />
                  <div style="font-size: 10px; color: #666; margin-top: 4px; text-align: center">
                    图片 {{ index + 1 }}
                  </div>

                  <!-- 操作按钮 -->
                  <div style="position: absolute; top: 4px; right: 4px; display: flex; gap: 4px">
                    <!-- 向左移动 -->
                    <n-button
                      v-if="index > 0"
                      size="tiny"
                      type="info"
                      quaternary
                      circle
                      @click="moveCarouselImage(index, index - 1)"
                      style="width: 20px; height: 20px; background: rgba(255, 255, 255, 0.9)"
                    >
                      <template #icon>
                        <n-icon size="12">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                          </svg>
                        </n-icon>
                      </template>
                    </n-button>

                    <!-- 向右移动 -->
                    <n-button
                      v-if="index < formData.images.length - 1"
                      size="tiny"
                      type="info"
                      quaternary
                      circle
                      @click="moveCarouselImage(index, index + 1)"
                      style="width: 20px; height: 20px; background: rgba(255, 255, 255, 0.9)"
                    >
                      <template #icon>
                        <n-icon size="12">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                          </svg>
                        </n-icon>
                      </template>
                    </n-button>

                    <!-- 删除按钮 -->
                    <n-button
                      size="tiny"
                      type="error"
                      quaternary
                      circle
                      @click="removeCarouselImage(index)"
                      style="width: 20px; height: 20px; background: rgba(255, 255, 255, 0.9)"
                    >
                      <template #icon>
                        <n-icon size="12"><Close /></n-icon>
                      </template>
                    </n-button>
                  </div>
                </div>
              </div>

              <div
                v-else
                style="
                  padding: 20px;
                  text-align: center;
                  color: #999;
                  border: 1px dashed #d9d9d9;
                  border-radius: 6px;
                  background: #fafafa;
                "
              >
                暂无轮播图片，点击"添加图片"按钮上传
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
  import { getCategoriesApi } from '../../api/categories';
  import config from '../../config/index';

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

  const formData = reactive<{
    id: null | number;
    title: string;
    desc: string;
    size: string;
    version: string;
    iconClass: string;
    iconPath: string;
    link: string;
    category: number;
    status: number;
    images: string[];
  }>({
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
    images: [], // 轮播图片数组
  });

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 50],
    showQuickJumper: true,
    prefix({ itemCount }) {
      return `共 ${itemCount} 条`;
    },
  });

  const categoryOptions = ref([{ label: '全部/近期更新', value: 0 }]);

  const iconClassOptions = [
    { label: 'camera', value: 'camera' },
    { label: 'wechat', value: 'wechat' },
    { label: 'music', value: 'music' },
    { label: 'poem', value: 'poem' },
  ];

  const formRules = {
    title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    desc: [{ message: '请输入商品描述', trigger: 'blur' }],
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
    {
      title: '序号',
      key: 'index',
      width: 80,
      fixed: 'left',
      render: (_row, index) => {
        return (pagination.page - 1) * pagination.pageSize + index + 1;
      },
    },
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
          alt: row.title || '商品图标',
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
    { title: '商品名称', key: 'title', width: 150 },
    {
      title: '轮播图',
      key: 'images',
      width: 120,
      render: (row) => {
        if (!row.images || !Array.isArray(row.images) || row.images.length === 0) {
          return h(
            'div',
            {
              style: {
                color: '#999',
                fontSize: '12px',
              },
            },
            '无轮播图'
          );
        }

        return h(
          'div',
          {
            style: {
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
            },
          },
          row.images
            .slice(0, 3)
            .map((image, index) =>
              h(NImage, {
                key: index,
                src: image,
                alt: `轮播图${index + 1}`,
                width: 30,
                height: 30,
                objectFit: 'cover',
                previewDisabled: false,
                style: {
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                },
                fallbackSrc:
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRkFGQUZBIi8+CjxwYXRoIGQ9Ik0xNSAyMUwxNSA5TTE1IDlMMTIgMTJNMTUgOUwxOCAxMiIgc3Ryb2tlPSIjQzNDM0MzIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K',
              })
            )
            .concat(
              row.images.length > 3
                ? [
                    h(
                      'div',
                      {
                        style: {
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                          color: '#666',
                          fontSize: '10px',
                        },
                      },
                      `+${row.images.length - 3}`
                    ),
                  ]
                : []
            )
        );
      },
    },
    { title: '描述', key: 'desc', ellipsis: { tooltip: false } },
    { title: '文件大小', key: 'size', width: 100 },
    { title: '版本', key: 'version', width: 100 },
    {
      title: '分类',
      key: 'category',
      width: 120,
      render: (row) => {
        // 先尝试通过值查找
        let category = categoryOptions.value.find((item) => item.value === row.category);

        // 如果找不到，返回"未知"
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

      if (response && response.code === 200) {
        dataList.value = Array.isArray(response.data) ? response.data : [];
        pagination.itemCount = response.count || 0;
      } else {
        message.error(response?.message || '获取数据失败');
        console.error('API错误:', response);
      }
    } catch (error) {
      message.error('获取商品列表失败');
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

  const handlePageSizeChange = (pageSize: number) => {
    pagination.page = 1;
    pagination.pageSize = pageSize;
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
    formData.images = [];

    showModal.value = true;
  };

  // 获取Token函数
  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  // 处理图标上传成功
  const handleIconUploadFinish = ({ event }) => {
    try {
      const response = JSON.parse(event.target.response);

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
        message.error(response.message || '上传失败');
      }
    } catch (error) {
      console.error('解析上传响应失败:', error);
      message.error('上传失败，请检查网络连接');
    }
  };

  // 处理图标上传错误
  const handleIconUploadError = ({ event }) => {
    console.error('图标上传失败:', event);
    message.error('图标上传失败，请重试');
  };

  // 处理轮播图片上传成功
  const handleCarouselImageUploadFinish = ({ event }) => {
    try {
      const response = JSON.parse(event.target.response);

      if (response.code === 200) {
        // 添加到轮播图片数组中
        if (!formData.images) {
          formData.images = [];
        }

        // 处理多文件上传响应，data是数组格式
        if (Array.isArray(response.data)) {
          const newImageUrls = response.data.map((file) => file.url);
          formData.images.push(...newImageUrls);
          message.success(`成功上传 ${response.data.length} 张轮播图片`);
        } else {
          // 兼容单文件上传格式
          formData.images.push(response.data.url);
          message.success('轮播图片上传成功');
        }

      } else {
        console.error('上传失败，响应内容:', response);
        message.error(response.message || response.msg || '轮播图片上传失败');
      }
    } catch (error) {
      console.error('解析轮播图片上传响应失败:', error);
      console.error('原始响应内容:', event.target.response);
      message.error('轮播图片上传失败，请检查网络连接');
    }
  };

  // 处理轮播图片上传错误
  const handleCarouselImageUploadError = ({ event }) => {
    console.error('轮播图片上传失败:', event);
    message.error('轮播图片上传失败，请重试');
  };

  // 移动轮播图片位置
  const moveCarouselImage = (fromIndex, toIndex) => {
    if (
      !formData.images ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= formData.images.length ||
      toIndex >= formData.images.length
    ) {
      return;
    }

    const images = [...formData.images];
    const [movedItem] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, movedItem);
    formData.images = images;
  };

  // 删除轮播图片
  const removeCarouselImage = (index) => {
    if (!formData.images || index < 0 || index >= formData.images.length) {
      return;
    }

    formData.images.splice(index, 1);
  };

  const handleEdit = (row) => {

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
    formData.images = row.images && Array.isArray(row.images) ? [...row.images] : [];

    showModal.value = true;
  };

  const handleView = (row) => {
    dialog.info({
      title: '商品详情',
      content: `名称: ${row.title}\n描述: ${row.desc}\n大小: ${row.size}\n版本: ${row.version}\n链接: ${row.link}`,
      positiveText: '确定',
    });
  };

  const handleDelete = (row) => {
    dialog.warning({
      title: '确认删除',
      content: `确定要删除商品 "${row.title}" 吗？`,
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          const response = await deleteToolApi(row.id);
          if (response && response.code === 200) {
            message.success('删除成功');
            getToolsList();
          } else {
            message.error(response?.message || '删除失败');
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

      const isEdit = !!formData.id;

      const response = isEdit ? await updateToolApi(formData) : await addToolApi(formData);

      if (response && response.code === 200) {
        message.success(isEdit ? '更新成功' : '添加成功');
        showModal.value = false;
        // 保存成功后刷新列表
        await getToolsList();
      } else {
        message.error(response?.message || '保存失败');
        console.error('保存失败，API返回:', response);
      }
    } catch (error) {
      message.error('保存失败');
      console.error('保存错误:', error);
    }
  };

  // 获取分类选项列表
  const getCategoryOptions = async () => {
    try {
      // 使用options接口来获取分类选项
      const response = await getCategoriesApi({ path: 'options' });

      if (response && response.code === 200 && response.data) {
        const apiOptions = response.data;

        // 检查API返回的选项中是否已包含"全部/近期更新"
        const hasDefaultOption = apiOptions.some((opt) => opt.label === '全部/近期更新');

        if (!hasDefaultOption) {
          // 如果API返回的数据中不包含"全部/近期更新"，则添加默认选项
          const defaultOption = { label: '全部/近期更新', value: 0 };
          categoryOptions.value = [defaultOption, ...apiOptions];
        } else {
          // API已经包含了默认选项，直接使用API返回的数据
          categoryOptions.value = apiOptions;
        }
      }
    } catch (error) {
      console.error('获取分类选项失败:', error);
    }
  };

  onMounted(() => {
    getToolsList();
    getCategoryOptions();
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
