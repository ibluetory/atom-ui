<template>
    <div class="page">
        <el-card shadow="hover">
            <div slot="header" class="header">
                <el-button class="btn-add" type="primary" icon="el-icon-plus" size="mini" @click="handleOpen">新增
                </el-button>
            </div>
            <el-table :data="userList" border stripe size="middle">
                <el-table-column type="index" width="50" align="center"/>
                <el-table-column prop="name" label="姓名" align="center"/>
                <el-table-column prop="mobile" label="手机" align="center"/>
                <el-table-column prop="createTime" label="创建时间" align="center" sortable width="180"/>
                <el-table-column label="操作" width="140px" align="center">
                    <template slot-scope="scope">
                        <el-button-group>
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
                    <el-form-item label="姓名" prop="name">
                        <el-input class="form-item" v-model="form.name" autocomplete="off" clearable/>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" type="password" placeholder="请设置密码" maxlength="32"></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="deptIds">
                        <el-select v-model="form.deptIds" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in deptList"
                                    :key="'dept' + item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
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
        </el-card>
    </div>
</template>

<script>
    import md5 from 'js-md5';
    import {deleteById, page, saveOrUpdate} from '@/api/user'
    import {list as deptList} from '@/api/dept'
    import {list as roleList} from '@/api/role'

    export default {
        name: "user",
        data() {
            return {
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                userList: [],                   // 用户列表
                deptList: [],                   // 部门列表
                roleList: [],                   // 角色列表
                title: '',                      // 弹框名称
                dialogFormVisible: false,
                formLabelWidth: '90px',
                form: {
                    id: '',
                    name: '',
                    mobile: '',
                    password: '',
                    deptIds: [],
                    roleIds: [],
                    status: '1'
                },
                // 验证规则
                rules: {
                    name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.pageList()
            this.getDeptList()
            this.getRoleList()
        },
        methods: {
            // 列表查询
            pageList() {
                page(this.page).then(response => {
                    this.userList = response.data.records
                    this.page.total = response.data.total
                })
            },

            // 获取部门列表
            getDeptList() {
                deptList().then(response => {
                    this.deptList = response.data
                })
            },

            // 获取角色列表
            getRoleList() {
                roleList().then(response => {
                    this.roleList = response.data
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
                this.form = {id: '', name: '', mobile: '', deptIds: [], roleIds: [], status: '1'}
            },

            // 关闭显示弹框
            handleOpen() {
                this.title = "新增"
                this.dialogFormVisible = true
            },

            // 关闭弹窗
            handleClose() {
                this.dialogFormVisible = false
                this.initForm()
            },


            // 编辑
            edit(index) {
                this.title = "编辑"
                this.dialogFormVisible = true
                this.form = this.userList[index]
            },


            // 添加或者编辑
            handleSubmit(form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        // 密码加密
                        if (form.id === '') {
                            form.password = md5(form.password)
                        }

                        saveOrUpdate(form).then(() => {
                            this.pageList()
                            // 操作提示
                            this.$message({message: '操作成功', type: 'success', center: true})
                        })
                        this.handleClose()
                    } else {
                        return false
                    }
                })
            },

            // 删除
            del(index) {
                this.$confirm('确定要删除该用户吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    const item = this.userList[index]
                    deleteById(item.id).then(() => {
                        this.pageList()
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
    >>> .el-select {
        width: 100%;
    }

    .header {
        text-align: right;
    }
</style>
