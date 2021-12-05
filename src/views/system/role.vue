<template>
    <div class="page">
        <el-card shadow="hover">
            <div slot="header" class="header">
                <el-button class="btn-add" type="primary" icon="el-icon-plus" size="mini" @click="handleOpen">新增
                </el-button>
            </div>
            <el-table :data="roleList" border stripe size="middle">
                <el-table-column type="index" width="50" align="center"/>
                <el-table-column prop="name" label="名称" align="center"/>
                <el-table-column prop="description" label="描述" align="center"/>
                <el-table-column prop="createTime" label="创建时间" align="center" sortable width="180"/>
                <el-table-column label="操作" width="220" align="center">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" plain round size="mini" @click="configRole(scope.$index)">配置
                            </el-button>
                            <el-button type="warning" round size="mini" @click="edit(scope.$index)">编辑</el-button>
                            <el-button type="danger" round size="mini" @click="del(scope.$index)">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pagination"
                           :current-page="page.currentPage"
                           :page-sizes="[10, 20, 20, 50]"
                           :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next"
                           :total="page.total"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"/>


            <!--新增或编辑-->
            <el-dialog :title="title" :visible.sync="dialogFormVisible" :before-close="handleClose">
                <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
                    <el-form-item label="名称" prop="name">
                        <el-input class="form-item" v-model="form.name" autocomplete="off" clearable/>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="form.description" placeholder="请输入角色描述" maxlength="32"
                                  show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="handleSubmit(form)">确 定</el-button>
                </div>
            </el-dialog>

            <!--授权-->
            <el-drawer ref="drawer" title="配置权限" :visible.sync="drawer" direction="rtl" :before-close="handleClose"
                       size="30%">
                <el-tree ref="tree" :data="menuTree" :default-checked-keys="checkedKeys" class="tree" node-key="id"
                         show-checkbox default-expand-all highlight-current check-strictly
                         :props="defaultProps"></el-tree>

                <div style="text-align: center; margin-top: 30px;">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="submitRoleMenu">保存</el-button>
                </div>
            </el-drawer>
        </el-card>
    </div>
</template>

<script>
    import {deleteById, menuTree, page, saveOrUpdate, setMenu} from '@/api/role'
    import {tree} from '@/api/menu'

    export default {
        name: "role",
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                menuTree: [],                   // 菜单树
                checkedKeys: [],                // 已选中的菜单
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                roleList: [],
                title: '',                      // 弹框名称
                dialogFormVisible: false,
                formLabelWidth: '90px',
                form: {
                    id: '',
                    name: '',
                    description: ''
                },
                // 验证规则
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    description: [
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ]
                },

                currentRole: null,      // 当前角色
                drawer: false,
            }
        },
        created() {
            this.pageList()
            this.getMenuTree()
        },
        methods: {
            // 获取菜单树
            getMenuTree() {
                tree().then(response => {
                    this.menuTree = response.data
                })
            },

            // 列表查询
            pageList() {
                page(this.page).then(response => {
                    this.roleList = response.data.records
                    this.page.total = response.data.total
                })
            },

            // 每页 ${val} 条
            handleSizeChange(size) {
                this.page.size = size
                this.pageList()
            },

            // 当前页: ${val}
            handleCurrentChange(currentPage) {
                this.page.current = currentPage
                this.pageList()
            },

            // 初始化表单数据
            initForm() {
                this.form = {id: '', name: '', description: ''}
            },

            // 关闭显示弹框
            handleOpen() {
                this.title = "新增"
                this.dialogFormVisible = true
            },

            // 关闭弹窗
            handleClose() {
                this.dialogFormVisible = false
                this.drawer = false
                this.initForm()
            },


            // 编辑
            edit(index) {
                this.title = "编辑"
                this.dialogFormVisible = true
                this.form = this.roleList[index]
            },


            // 添加或者编辑
            handleSubmit(form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        saveOrUpdate(form).then(() => {
                            this.pageList()
                        })
                        this.handleClose()
                    } else {
                        return false
                    }
                })
            },

            // 删除
            del(index) {
                this.$confirm('确定要删除吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const item = this.roleList[index]
                    deleteById(item.id).then(() => {
                        this.pageList()
                        // 操作提示
                        this.$message({message: '删除成功', type: 'success', center: true})
                    }).catch(() => {
                        this.pageList()
                    })
                })
            },

            // 配置菜单与权限
            configRole(index) {
                this.drawer = true
                setTimeout(() => {
                    this.$refs.tree.setCheckedKeys([])
                    this.currentRole = this.roleList[index]
                    // 获取角色已配置的菜单
                    menuTree(this.currentRole.id).then(response => {
                        this.checkedKeys = response.data
                    })
                }, 300)
            },

            // 提交角色配置的菜单
            submitRoleMenu() {
                // 半选中节点加上选中的节点
                let currentCheckedKeys = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
                const param = {
                    menuIds: currentCheckedKeys,
                    roleId: this.currentRole.id
                }

                setMenu(param).then(() => {
                    this.drawer = false
                    this.$message({message: '设置成功', type: 'success', center: true})
                })
            }
        }
    }
</script>

<style scoped>
    .header {
        text-align: right;
    }

    .tree {
        max-height: calc(100vh - 220px);
        overflow-y: auto;
    }
</style>

<!--去除 element-ui 打开Drawer 标题自带蓝色框-->
<style rel="stylesheet/scss" lang="scss">
    :focus {
        outline: 0;
    }
</style>

