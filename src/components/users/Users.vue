<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="user-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入用户名" v-model="queryStr" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="queryUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="showUserAddDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <!--
    el-table 表格组件
    data 用来给表格组件提供数据
    stripe 添加该属性后，启用隔行变色效果

    el-table-column表格中的每一行
    label每一列的标题名称
    width每一列的宽度
    prop表示数据中的属性名（字段名称）
     -->

    <el-table :data="userList" stripe>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态">
        <template slot-scope="scope">
          <!-- 状态开关 -->
          <!--
            v-model 用来绑定数据
            active-color="#409EFF" 启用时的颜色
            inactive-color="#C0CCDA" 禁用时的颜色
            这里默认 可不写
           -->
          <el-switch
            v-model="scope.row.mg_state" @change="changeUserState(scope.row.id,scope.row.mg_state)"
            >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="showUserEditDialog(scope.row)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
          <!-- 分配角色按钮 -->
          <el-button type="success" plain size="mini" icon="el-icon-check" @click="showUserAssignDialog(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
      分页组件
        background 背景色
        layout 分页显示的内容
        total 总条数

        给 current-page 属性添加 .sync 修饰符后, 就可以设置当前页
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize" :current-page.sync="curPage"
      @current-change="changePage" >
    </el-pagination>

    <!-- 添加用户对话框 模态框 -->
    <el-dialog title="添加用户" :visible.sync="userAddDialog" @close="closeUserAddDialog">
      <el-form :model="userAddForm" :rules="userAddRules" ref="userAddForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input v-model="userAddForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-width="120px">
          <el-input v-model="userAddForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userAddForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userAddForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAddDialig = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="userEditDialog" @close="closeUserEditDialog">
      <el-form :model="userEditForm" :rules="userEditRules" ref="userEditForm">
        <el-form-item prop="username" label="用户名" label-width="120px">
          <el-input disabled :value="userEditForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" label-width="120px">
          <el-input v-model="userEditForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" label-width="120px">
          <el-input v-model="userEditForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="userAssignDialog">
      <el-form :model="userAssignForm">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="userAssignForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" label-width="120px">
          <el-select v-model="userAssignForm.rid" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAssignDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// 组件中不需导入了，在公共main.js中一次性导入
// import axios from 'axios'
// axios换成this.$http

export default {
  created() {
    // 发送请求 获取数据
    this.getUserList()
  },

  data() {
    return {
      userList: [],
      // 每页大小
      pageSize: 2,
      // 当前页码
      curPage: 1,
      // 总条数
      total: 0,
      // 搜索内容
      queryStr: '',

      // 控制用户添加对话框的展示与隐藏
      userAddDialog: false,
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      userAddRules: {
        username: [
          {required: true, message: '用户名为必填项', trigger: 'blur'},
          {
            min: 3,
            max: 6,
            message: '用户名长度在3到6个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: '密码为必填项', trigger: 'blur'},
          {
            min: 3,
            max: 6,
            message: '密码长度在3到6个字符',
            trigger: 'blur'
          }
        ]
      },

      // 控制编辑用户对话框的显示与隐藏
      userEditDialog: false,
      userEditForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      userEditRules: {
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',

            // 如果需要在值改变或失去焦点的时候，都触发验证，可以传递两个
            // trigger:'change,blur'

            // 当前值改变就会触发
            trigger: 'change'
          }
        ]
      },

      // 分配角色
      userAssignDialog: false,
      userAssignForm: {
        // 用户id
        id: '',
        // 用户角色id
        rid: '',
        // 用户名
        username: ''
      },
      // 角色列表
      options: []
    }
  },

  methods: {
    // 获取用户列表数据
    // curPage = 1 给参数添加默认值

    // 方法一：
    // getUserList(curPage = 1) {
    //   this.$http
    //     .get('/users', {
    //       params: {
    //         // 当前页
    //         pagenum: curPage,
    //         // 每页展示多少数据
    //         pagesize: 2,
    //         // 查询条件
    //         query: this.queryStr || ''
    //       }
    //     })
    //     .then(res => {
    //       console.log(res)
    //       const { data, meta } = res.data
    //       if (meta.status === 200) {
    //         // 获取数据成功
    //         this.userList = data.users
    //         this.total = data.total
    //         this.curPage = data.pagenum
    //       }
    //     })
    // },

    // 方法二：
    async getUserList(curPage = 1) {
      const res = await this.$http
        .get('/users', {
          params: {
            // 当前页
            pagenum: curPage,
            // 每页展示多少数据
            pagesize: 2,
            // 查询条件
            query: this.queryStr || ''
          }
        })
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        // 获取数据成功
        this.userList = data.users
        this.total = data.total
        this.curPage = data.pagenum
      }
    },
    // 分页获取数据
    changePage(curPage) {
      console.log('当前页为：', curPage)
      this.getUserList(curPage)
    },

    // 搜索框
    queryUserList() {
      console.log(this.queryStr)
      this.curPage = 1
      this.getUserList()
    },

    // 修改用户状态 启用禁用
    async changeUserState(id, curState) {
      // console.log(id, curState)
      // 发送请求
      const res = await this.$http
        .put(`/users/${id}/state/${curState}`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: data.mg_state === 0 ? '禁用成功' : '启用成功',
          duration: 1000
        })
      } else {
        this.$message({
          type: 'error',
          message: meta.msg,
          duration: 1000
        })
      }
    },

    // 展示用户添加对话框
    showUserAddDialog() {
      this.userAddDialog = true
    },

    // 关闭添加用户对话框 重置表单
    closeUserAddDialog() {
      console.log('对话框关闭了')
      this.$refs.userAddForm.resetFields()
    },

    // 添加用户
    addUser() {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          // 成功
          // console.log('验证成功')
          this.$http.post('/users', this.userAddForm).then(res => {
            // console.log(res)
            const { meta } = res.data
            if (meta.status === 201) {
              // 1 关闭对话框
              // 2 重置表单(只要关闭对话框，就会自动触发对话框的关闭事件来重置表单)
              this.userAddDialog = false

              // 3 重新获取列表数据
              this.getUserList()
              // this.curPage = 1
            }
          })
        } else {
          // console.log('验证失败')
          return false
        }
      })
    },

    // 根据id删除用户
    delUserById(id) {
      console.log(id)
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`users/${id}`).then(res => {
          console.log(res)
          const { meta } = res.data
          if (meta.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })

            // 删除后到第一页
            // this.getUserList()
            // this.curPage = 1

            // 删除后停留在该页，没有数据往前一页
            // eslint-disable-next-line eqeqeq
            const index = this.userList.findIndex(item => item.id == id)
            this.userList.splice(index, 1)
            const totalPage = Math.ceil(this.userList.length / this.pageSize)
            if (this.curPage > totalPage) {
              this.getUserList(--this.curPage)
            }
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 展示编辑用户对话框
    showUserEditDialog(curUser) {
      console.log(curUser)
      // 对话框需要获取当前用户数据，获取到后，数据交给userForm后，就会展示在编辑对话框中
      for (const key in this.userEditForm) {
        this.userEditForm[key] = curUser[key]
      }
      // 打开用户编辑对话框
      this.userEditDialog = true
    },

    // 关闭编辑对话框
    closeUserEditDialog() {
      this.$refs.userEditForm.resetFields()
    },

    // 点击确定按钮  修改用户数据
    editUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          // console.log('表单验证成功')
          const { id, email, mobile } = this.userEditForm
          this.$http
            .put(`/users/${id}`, {email, mobile})
            .then(res => {
              const {data, meta} = res.data
              if (meta.status === 200) {
                // 更新该用户的数据
                const editUser = this.userList.find(item => item.id === id)
                editUser.email = data.email
                editUser.mobile = data.mobile

                // 关闭对话框
                this.userEditDialog = false
              }
            })
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },

    // 显示用户分配角色对话框
    async showUserAssignDialog(curUser) {
      this.userAssignDialog = true
      this.userAssignForm.id = curUser.id
      this.userAssignForm.username = curUser.username

      // 发送请求 获取用户的角色id
      // eslint-disable-next-line no-undef
      const res = await this.$http.get(`users/${curUser.id}`)
      const {meta, data} = res.data
      if (meta.status === 200) {
        if (data.rid === -1) {
          this.userAssignForm.rid = ''
        } else {
          this.userAssignForm.rid = data.rid
        }
      }
      // 获取角色列表数据
      this.getRoleList()
    },
    // 下拉   获取角色列表数据
    async getRoleList() {
      const res = await this.$http.get('roles')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 点击确定  分配用户的角色
    async assignRole() {
      if (!this.userAssignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      const res = await this.$http.put(`users/${this.userAssignForm.id}/role`, {
        rid: this.userAssignForm.rid
      })
      const {meta} = res.data
      if (meta.status === 200) {
        // 隐藏分配模态框
        this.userAssignDialog = false
        // 重新渲染
        this.getUserList()
        // 提示信息
        this.$message.success('分配角色成功')
      }
    }
  }
}
</script>

<style>
  .user-breadcrumb {
    line-height: 40px;
    background-color: #d4dae0;
    font-size: 16px;
    padding-left: 10px;
  }
</style>
