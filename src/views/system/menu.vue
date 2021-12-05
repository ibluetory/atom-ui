<template>
    <div class="page">
        <el-card shadow="hover" class="card">
            <div slot="header" class="header">
                <el-input class="tree-search" placeholder="请输入部门名称" v-model="filterText" size="small" clearable
                          suffix-icon="el-icon-search"></el-input>
                <el-button class="btn-add" type="primary" icon="el-icon-plus" size="mini" @click="handleOpen">新增
                </el-button>
            </div>

            <el-tree :data="menuTree" class="tree" node-key="id" :props="defaultProps" default-expand-all
                     highlight-current :filter-node-method="filterNode" ref="tree"
                     :expand-on-click-node="false" @node-click="nodeClick">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button type="text" size="mini" @click="() => remove(node, data)">
                            <i class="el-icon-delete"></i>
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </el-card>
        <el-tabs type="border-card" class="card" v-model="tab">
            <el-tab-pane label="基本信息" name="1">
                <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
                    <el-form-item label="菜单名称" prop="name">
                        <el-input class="form-item" placeholder="name" v-model="form.name" autocomplete="off"
                                  clearable/>
                    </el-form-item>
                    <el-form-item label="上级菜单" prop="parentId">
                        <el-select v-model="form.parentId" placeholder="一级菜单" filterable :clearable="true">
                            <el-option v-for="item in menuList" :key="item.id" :label="item.name" :value="item.id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组件位置" prop="component">
                        <el-input class="form-item" placeholder="一级菜单:layout" v-model="form.component"
                                  autocomplete="off" clearable/>
                    </el-form-item>
                    <el-form-item label="菜单路径" prop="path">
                        <el-input class="form-item" placeholder="/path, 以/开头" v-model="form.path" autocomplete="off"
                                  clearable/>
                    </el-form-item>
                    <el-form-item label="菜单标题" prop="title">
                        <el-input class="form-item" placeholder="title" v-model="form.title" autocomplete="off"
                                  clearable/>
                    </el-form-item>
                    <el-form-item label="菜单图标" prop="icon">
                        <el-input class="form-item" placeholder="icon" v-model="form.icon" autocomplete="off"
                                  clearable/>
                    </el-form-item>
                    <el-form-item label="排序值" prop="sort">
                        <el-input-number v-model="form.sort" :step="1" :min="0" :max="100"></el-input-number>
                        <el-switch v-model="form.hidden" class="switch" active-text="隐藏" inactive-text="显示"
                                   active-value="1" inactive-value="0"></el-switch>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio label="1" border>启用</el-radio>
                            <el-radio label="0" border>无效</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div style="text-align: center; margin-top: 30px;">
                        <el-button @click="handleClose">清 空</el-button>
                        <el-button type="primary" @click="handleSubmit(form)">保存</el-button>
                    </div>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <!--新增菜单-->
        <el-dialog title="新增" :visible.sync="dialogFormVisible" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
                <el-form-item label="菜单名称" prop="name">
                    <el-input class="form-item" placeholder="name" v-model="form.name" autocomplete="off"
                              clearable/>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentId">
                    <el-select v-model="form.parentId" placeholder="一级菜单" filterable :clearable="true">
                        <el-option v-for="item in menuList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="组件位置" prop="component">
                    <el-input class="form-item" placeholder="一级菜单:layout" v-model="form.component" autocomplete="off"
                              clearable/>
                </el-form-item>
                <el-form-item label="菜单路径" prop="path">
                    <el-input class="form-item" placeholder="/path, 以/开头" v-model="form.path" autocomplete="off"
                              clearable/>
                </el-form-item>
                <el-form-item label="菜单标题" prop="title">
                    <el-input class="form-item" placeholder="title" v-model="form.title" autocomplete="off"
                              clearable/>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input class="form-item" placeholder="icon" v-model="form.icon" autocomplete="off"
                              clearable/>
                </el-form-item>
                <el-form-item label="排序值" prop="sort">
                    <el-input-number v-model="form.sort" :step="1" :min="0" :max="100"></el-input-number>
                    <el-switch v-model="form.hidden" class="switch" active-text="隐藏" inactive-text="显示"
                               active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1" border>启用</el-radio>
                        <el-radio label="0" border>无效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="handleSubmit(form)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {deleteById, getById, list, saveOrUpdate, tree} from '@/api/menu'

    export default {
        name: "menu-config",
        data() {
            return {
                filterText: '',                 // 菜单筛选
                menuTree: [],                   // 菜单树
                menuList: [],                   // 菜单列表
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                currentMenu: null,              // 当前菜单权限
                tab: '1',                       // tab
                dialogFormVisible: false,
                formLabelWidth: '90px',
                form: {
                    id: '',
                    parentId: null,
                    name: '',
                    path: '',
                    component: '',
                    hidden: '0',
                    title: '',
                    icon: '',
                    sort: '0',
                    status: '1'
                },

                // 验证规则
                rules: {
                    name: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    component: [
                        {required: true, message: '请输入组件位置', trigger: 'blur'},
                        {min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur'}
                    ],
                    path: [
                        {required: true, message: '请输入路由path', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: '请选择菜单排序值', trigger: 'change'},
                    ],
                    status: [
                        {required: true, message: '请选择菜单状态', trigger: 'change'},
                    ]
                },

            }
        },
        created() {
            this.getMenuTree()
            this.getMenuList()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            // 获取菜单树
            getMenuTree() {
                tree().then(response => {
                    this.menuTree = response.data
                })
            },

            // 获取菜单列表
            getMenuList() {
                list().then(response => {
                    this.menuList = response.data
                })
            },

            filterNode(value, data) {
                if (!value) {
                    return true;
                }
                return data.label.indexOf(value) !== -1;
            },

            // 选中节点
            nodeClick(item) {
                this.currentMenu = item
                getById(item.id).then(response => {
                    this.form = response.data
                })
            },

            // 初始化表单数据
            initForm() {
                this.form = {id: '', name: '', parentId: null, sort: '0', status: '1'}
            },

            // 关闭显示弹框
            handleOpen() {
                this.initForm()
                this.dialogFormVisible = true
            },

            // 关闭弹窗
            handleClose() {
                this.initForm()
                this.dialogFormVisible = false
            },

            // 添加或者编辑
            handleSubmit(form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        saveOrUpdate(form).then(() => {
                            this.getMenuTree()
                            this.getMenuList()
                            // 操作提示
                            this.$message({message: '操作成功', type: 'success', center: true})
                        })
                        this.handleClose()
                    } else {
                        return false
                    }
                })
            },

            // 树节点操作-删除
            remove(node, data) {
                this.$confirm('确定要删除【' + data.label + '】菜单及其子菜单吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteById(data.id).then(() => {
                        const parent = node.parent;
                        const children = parent.data.children || parent.data;
                        const index = children.findIndex(d => d.id === data.id);
                        children.splice(index, 1);
                        // 操作提示
                        this.$message({message: '删除成功', type: 'success', center: true})
                    }).catch(() => {
                        this.pageList()
                    })
                })
            },
        }
    }
</script>

<style scoped>
    .page {
        display: flex;
    }

    .header {
        text-align: center;
    }

    .card {
        width: 50%;
        margin-right: 10px;
    }

    .tree {
        max-height: calc(100vh - 220px);
        min-height: 430px;
        overflow-y: auto;
    }

    .tree-search {
        width: 60%;
        margin-right: 30px;
    }

    .switch {
        position: absolute;
        right: 30px;
    }

    >>> .el-select {
        width: 100%;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
