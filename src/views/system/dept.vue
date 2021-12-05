<template>
    <div class="page">
        <el-card shadow="hover" class="card">
            <div slot="header" class="header">
                <el-input class="tree-search" placeholder="请输入部门名称" v-model="filterText" size="small" clearable
                          suffix-icon="el-icon-search"></el-input>
                <el-button class="btn-add" type="primary" icon="el-icon-plus" size="mini" @click="handleOpen">新增
                </el-button>
            </div>

            <el-tree :data="deptTree" class="tree" node-key="id" :props="defaultProps" default-expand-all
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
                    <el-form-item label="机构名称" prop="name">
                        <el-input class="form-item" v-model="form.name" autocomplete="off" clearable/>
                    </el-form-item>
                    <el-form-item label="上级部门" prop="parentId">
                        <el-select v-model="form.parentId" disabled placeholder="一级部门" filterable :clearable="true">
                            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色" prop="deptIds">
                        <el-select v-model="form.roleIds" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in roleList"
                                    :key="'role'+item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序值" prop="sort">
                        <el-input-number v-model="form.sort" :step="1" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio label="1" border>启用</el-radio>
                            <el-radio label="0" border>无效</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div style="text-align: center; margin-top: 30px;">
                        <el-button>取 消</el-button>
                        <el-button type="primary" @click="handleSubmit(form)">保存</el-button>
                    </div>
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <!--新增部门-->
        <el-dialog title="新增" :visible.sync="dialogFormVisible" :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
                <el-form-item label="机构名称" prop="name">
                    <el-input class="form-item" v-model="form.name" autocomplete="off" clearable/>
                </el-form-item>
                <el-form-item label="上级部门" prop="parentId">
                    <el-select v-model="form.parentId" placeholder="一级部门" filterable :clearable="true">
                        <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="deptIds">
                    <el-select v-model="form.roleIds" multiple placeholder="请选择">
                        <el-option
                                v-for="item in roleList"
                                :key="'role'+item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序值" prop="sort">
                    <el-input-number v-model="form.sort" :step="1" :min="0" :max="100"></el-input-number>
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
    import {deleteById, getById, list, saveOrUpdate, tree} from '@/api/dept'
    import {list as roleList} from '@/api/role'

    export default {
        name: "dept",
        data() {
            return {
                filterText: '',                 // 部门筛选
                deptTree: [],                   // 部门树
                deptList: [],                   // 部门列表
                roleList: [],                   // 角色列表
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },

                currentDept: null,              // 当前部门
                tab: '1',                       // tab
                dialogFormVisible: false,
                formLabelWidth: '90px',
                form: {
                    id: '',
                    name: '',
                    parentId: null,
                    sort: '0',
                    status: '1',
                    roleIds: [],
                },

                // 验证规则
                rules: {
                    name: [
                        {required: true, message: '请输入机构名称', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: '请选择机构排序值', trigger: 'change'},
                    ],
                    status: [
                        {required: true, message: '请选择机构状态', trigger: 'change'},
                    ]
                },

            }
        },
        created() {
            this.getDeptTree()
            this.getDeptList()
            this.getRoleList()
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            // 获取部门树
            getDeptTree() {
                tree().then(response => {
                    this.deptTree = response.data
                })
            },

            // 获取部门列表
            getDeptList() {
                list().then(response => {
                    this.deptList = response.data
                })
            },

            // 获取角色列表
            getRoleList() {
                roleList().then(response => {
                    this.roleList = response.data
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
                this.currentDept = item
                getById(item.id).then(response => {
                    this.form = response.data
                })
            },

            // 初始化表单数据
            initForm() {
                this.form = {id: '', name: '', parentId: null, sort: '0', status: '1', roleIds: []}
            },

            // 关闭显示弹框
            handleOpen() {
                this.initForm()
                this.dialogFormVisible = true
            },

            // 关闭弹窗
            handleClose() {
                this.dialogFormVisible = false
            },

            // 添加或者编辑
            handleSubmit(form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        saveOrUpdate(form).then(() => {
                            this.getDeptTree()
                            this.getDeptList()
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
                this.$confirm('确定要删除【' + data.label + '】吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteById(data.id).then(() => {
                        this.getDeptTree()
                        this.getDeptList()
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
