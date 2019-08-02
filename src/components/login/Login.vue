<template>
  <div>
    <!-- 登录
    <el-button type="primary">成功按钮</el-button>-->

    <!--
      el-form
        label-position="top" 设置label的位置
        :model 用来给表单设置数据模型（对象）
        :rules 用来设置表单验证规则的
        ref 用来引用当前的表单组件

      el-form-item
        label 当前表单项的名称

      el-input
        v-model 实现双向数据绑定
    -->

    <el-form
      label-position="top"
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      class="loginForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // required 是否为必填项
          // message 当前规则校验失败时的提示
          // trigger 表单验证的触发实际，blur表示失去焦点时触发
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          // min 最小长度
          // max 最大长度
          {
            min: 3,
            max: 6,
            message: '用户名长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '密码长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 登录功能的实现
    login() {
      // 使用axios发送请求
      axios
        .post('http://localhost:8888/api/private/v1/login', this.loginForm)
        .then(res => {
          console.log(res)
          // const data =  res.data.data
          // const meta = res.data.meta

          // es6中的解构 意思就是从res.data中取出属性data好人meta
          const { data, meta } = res.data

          if (meta.status === 200) {
            localStorage.setItem('token', data.token)

            this.$router.push('/home')
          } else {
            this.$message({
              type: 'error',
              message: meta.msg,
              duration: 1000
            })
          }
        })
    },
    submitForm() {
      // ref用在组件中，就表示当前组件
      // this.$refs.loginForm
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // alert('submit!')
          // 成功 调用登录接口
          this.login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style>
</style>
