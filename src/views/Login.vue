<template>

  <body id="poster">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
          <h2 class="title">座位预约管理系统</h2>
          <el-form-item prop="account">
            <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item style="width:100%;">
            <el-button style="width:48%;" type="primary"  @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
            <el-button style="width:48%;" type="primary" @click.native.prevent="handleReg">注册</el-button>
          </el-form-item>
        </el-form>

  </body>


</template>

<script>
  import { requestLogin } from '../api/api';

  export default {

    data() {
      return {

        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
        handleReg(){
          //注册账号
            this.$router.push("/reg")
        },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            requestLogin(loginParams).then(data => {
              this.logining = false;
              // console.log('传入参数');
              // console.log(loginParams);
              //
              // console.log('返回参数');
              // console.log(data);
              let msg;
              let success;
              let user;
              if (data.detail=='登录成功'){
                msg='操作成功';
                success=true;
                user=data.data;
              }

              // let { msg, success, user } = data;
              if (!success) {
                this.$message({
                  message: msg,
                  type: msg
                });
              } else {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/index' });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    width: 350px;
    margin-top: 180px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
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
      background:url("../../static/img/bg.jpg") no-repeat;
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