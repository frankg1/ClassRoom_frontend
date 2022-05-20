<template>
    <body id="poster">
    <el-form :model="user" ref="userForm" :rules="formRules" label-position="left" label-width="100px" class="demo-ruleForm login-container">
        <h3 class="title">教室预约系统-注册账号</h3>
        <el-form-item prop="username"label="用户名">
            <el-input type="text" v-model="user.username" auto-complete="off" placeholder="请输入账号！"></el-input>
        </el-form-item>
        <el-form-item prop="stuNo"label="学号">
            <el-input type="text" v-model="user.stuNo" auto-complete="off" placeholder="请输入学号！"></el-input>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号码">
            <el-input type="text" v-model="user.phoneNum" auto-complete="off" placeholder="请输入电话！"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮件">
            <el-input type="text" v-model="user.email" auto-complete="off" placeholder="请输入邮件！"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="user.password" auto-complete="off" placeholder="请输入密码！"></el-input>
        </el-form-item>
        <el-form-item prop="comfirmPassword" label="确认密码">
            <el-input type="password" v-model="user.comfirmPassword" auto-complete="off" placeholder="请输入确认密码！"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:45%;" @click.native.prevent="loginUser" >登录</el-button>
            <el-button type="primary" style="width:45%;" @click.native.prevent="regAccount" >注册</el-button>
        </el-form-item>
    </el-form>
    </body>
</template>

<script>
    import { regUser } from '../../api/api';
    export default {
        data() {
            var validatePass2 = (rule, value, callback) => {
                console.log(value); //确认密码
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.user.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {

                //user:tenant 为了做数据表单校验不要嵌套对象
                user: {
                    username:'',
                    stuNo:'',
                    phoneNum:'',
                    email:'',
                    password:'',
                    comfirmPassword:''
                },
                formRules: {

                    username: [
                        { required: true, message: '请输入账号!', trigger: 'blur' }
                    ],
                    stuNo: [
                        { required: true, message: '请输入学号' }, // 'blur'是鼠标失去焦点的时候会触发验证
                        { min: 8, max: 8, message: '长度是8个字符' }
                    ],
                    phoneNum: [
                        { required: true, message: '请输入电话!', trigger: 'blur' }
                    ],
                    email: [
                        { type: 'email',required: true, message: '请输入邮箱!', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码!', trigger: 'blur' }
                    ],
                    comfirmPassword: [
                        {required: true,validator: validatePass2, trigger: 'blur' } //自定义校验规则
                    ]
                }
            };
        },
        methods: {
            loginUser(){
                this.$router.push("/login")
            },
            regAccount(){
                this.$refs.userForm.validate((valid) => {
                    //校验表单成功后才做一下操作
                    if (valid) {
                        this.$confirm('确认注册吗？', '提示', {}).then(() => {
                            //拷贝后面对象的值到新对象,防止后面代码改动引起模型变化
                            let para = Object.assign({}, this.user);
                            console.log('注册参数');
                            console.log(para);
                            regUser(para).then(data => {
                              console.log('返回参数');
                              console.log(data);
                              let msg=data.detail;
                              let success= msg=='注册成功'? true:false;


                                if(success){
                                    this.$message({
                                        message: '注册成功!',
                                        type: 'success'
                                    });
                                    //重置表单
                                    this.$refs['userForm'].resetFields();
                                    //跳转登录页面
                                    this.$router.push({ path: '/login' });
                                }
                                else{
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                }

                            });
                        });
                    }
                })
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin-top: 60px;
        margin-left: 500px;
        width: 500px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 5px #cac6c6;
    }
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }

        #poster {
            background:url("../../../static/img/bg.jpg") no-repeat;
            background-position: center;
            height: 100%;
            width: 100%;
            background-size: cover;
            position: fixed;
        }

        body{
            margin: 0px;
            padding: 0;
        }

</style>