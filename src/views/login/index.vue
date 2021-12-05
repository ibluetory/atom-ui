<template>
    <div class="login-container">
        <div class="title">{{title}}</div>
        <div class="login_content">
            <div class="login_header">
                <div class="login_type">欢 迎 登 录</div>
            </div>
            <div class="login_body">
                <el-form size="large" :rules="loginRules" ref="form" :model="form">
                    <el-form-item prop="mobile">
                        <el-input
                                v-model="form.mobile"
                                placeholder="请输入手机号"
                                name="mobile"
                                type="text">
                            <span slot="prefix" class="svg-container">
                              <svg-icon icon-class="user"/>
                            </span>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                                :key="passwordType"
                                ref="password"
                                v-model="form.password"
                                :type="passwordType"
                                placeholder="请输入密码"
                                auto-complete="on">
                            <span slot="prefix" class="svg-container">
                              <svg-icon icon-class="password"/>
                            </span>

                            <span slot="suffix" class="show-pwd" @click="showPwd">
                          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                        </span>
                        </el-input>
                    </el-form-item>
                    <el-button size="middle" :loading="loading" class="login-btn" @click.native.prevent="handleLogin">
                        登录
                    </el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    const defaultSettings = require('./../../settings.js')
    import md5 from 'js-md5';

    export default {
        name: 'Index',
        data() {
            const validateMobile = (rule, value, callback) => {
                if (!/^1[34578]\d{9}$/.test(value)) {
                    callback(new Error('请输入正确的手机号码'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('请输入密码'))
                } else {
                    callback()
                }
            }

            return {
                title: defaultSettings.title,
                form: {
                    mobile: '',
                    password: ''
                },
                passwordType: 'password',
                loading: false,
                loginRules: {
                    mobile: [{required: true, trigger: 'blur', validator: validateMobile}],
                    password: [{required: true, trigger: 'blur', validator: validatePassword}]
                },
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        methods: {
            showPwd() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },

            handleLogin() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let data = {
                            mobile: this.form.mobile,
                            password: md5(this.form.password)
                        }

                        this.loading = true
                        this.$store.dispatch('user/login', data).then(() => {
                            this.$router.push({path: this.redirect || '/'}, () => {})
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        this.loading = false
                        return false
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-container {
        height: 100%;
        width: 100%;
        background-color: #ffffff;
        overflow: hidden;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
         background: url("http://cn.bing.com/iod/1366/1024/") no-repeat fixed;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        user-select: none;
    }

    .login_content {
        width: 365px;
        height: 365px;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        background: #f9f9f9;
        overflow: hidden;
        position: relative;
    }

    .login_header {
        width: 100%;
        height: 64px;
        font-size: 18px;
        color: #898d90;
        overflow: hidden;
        border-bottom: 1px solid #e8e8e8;
    }

    .login_type {
        line-height: 60px;
        text-align: center;
        border-bottom: 4px solid transparent;
        cursor: pointer;
    }

    .login_body {
        width: 100%;
        height: 336px;
        text-align: center;
        position: relative;
        padding-bottom: 45px;
    }

    .el-form {
        position: relative;
        text-align: center;
        margin: 30px 30px;
    }

    .svg-container {
        margin-left: 3px;
    }

    .show-pwd {
        position: absolute;
        right: 4px;
        font-size: 16px;
        cursor: pointer;
        user-select: none;
    }

    .login-btn {
        background: #1942c9;
        width: 100%;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
    }

    .el-input {
        display: inline-block;
        height: 50px;

        input {
            background: transparent;
            -webkit-appearance: none;
            padding: 12px 5px 12px 15px;
            color: #fff;
            height: 50px;
            caret-color: #fff;
        }
    }

    .title {
        position: absolute;
        top: 168px;
        text-align: center;
        letter-spacing: 10px;
        color: #ffffff;
        font-size: 3em;
        -webkit-transition: all 1.8s ease;
        transition: all 1.8s ease;
    }

    @-webkit-keyframes Glow {
        from {
            text-shadow: 0 0 10px #fff,
            0 0 20px #fff,
            0 0 30px #fff,
            0 0 40px #1942c9,
            0 0 70px #1942c9,
            0 0 80px #1942c9,
            0 0 100px #1942c9,
            0 0 150px #1942c9;
        }
        to {
            text-shadow: 0 0 5px #fff,
            0 0 10px #fff,
            0 0 15px #fff,
            0 0 20px #1942c9,
            0 0 35px #1942c9,
            0 0 40px #1942c9,
            0 0 50px #1942c9,
            0 0 75px #1942c9;
        }
    }

    @keyframes Glow {
        from {
            text-shadow: 0 0 10px #fff,
            0 0 20px #fff,
            0 0 30px #fff,
            0 0 40px #1942c9,
            0 0 70px #1942c9,
            0 0 80px #1942c9,
            0 0 100px #1942c9,
            0 0 150px #1942c9;
        }
        to {
            text-shadow: 0 0 5px #fff,
            0 0 10px #fff,
            0 0 15px #fff,
            0 0 20px #1942c9,
            0 0 35px #1942c9,
            0 0 40px #1942c9,
            0 0 50px #1942c9,
            0 0 75px #1942c9;
        }
    }
</style>
