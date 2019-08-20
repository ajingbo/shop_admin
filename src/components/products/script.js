// 导入element-tree-grid包
var ElTreeGrid = require('element-tree-grid')
// 全局注册一个组件  组件名---->
// Vue.component('el-table-tree-column',ElTreeGrid);
export default {
  data() {
    return {
      categoryList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类的名称',
            trigger: 'change'
          }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },

  created() {
    // 获取列表数据
    this.getCategoryList()
  },

  methods: {
    // 功能1-获取分类列表
    async getCategoryList() {
      const res = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      const {
        meta: { status },
        data: { result, total }
      } = res.data
      if (status === 200) {
        this.categoryList = result
        this.total = total
        // 把loading加载状态清除
        setInterval(() => {
          this.loading = false
        }, 500)
      }
    },
    // 功能2-修改了每页的条数
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCategoryList()
    },
    // 功能3-修改当前页的页码
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getCategoryList()
    },
    // 功能4-添加分类模态框
    async showAddDialog() {
      this.addDialogVisible = true
      // 发送请求 获取分类数据（1级  2级）
      const res = await this.$http.get('categories?type=2')
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
        console.log(this.options)
      }
    },

    // 功能5-添加商品分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false
        }
        // 发送请求
        // this.axios.post('categories', {
        //   cat_pid: this.addForm.cat_pid[this.addForm.cat_pid.length - 1],
        //   cat_name: this.addForm.cat_name,
        //   cat_level: this.addForm.cat_pid.length
        // })

        // 发送请求  解构
        // eslint-disable-next-line camelcase
        const { cat_name, cat_pid } = this.addForm
        const res = await this.$http.post('categories', {
          // 如果添加一级分类  cat_pid为0
          cat_pid: cat_pid[cat_pid.length - 1] || 0,
          cat_name,
          cat_level: cat_pid.length
        })

        const {
          meta: { status, msg }
        } = res.data
        if (status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message = '添加商品分类成功'
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 功能6-删除商品分类
    async delCategory(row) {
      await this.$confirm('你确定要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      // 发送请求
      const res = await this.$http.delete(`categories/${row.cat_id}`)
      const {
        meta: { status, msg }
      } = res.data
      if (status === 200) {
        this.getCategoryList()
        this.$message.success('删除分类成功了')
      } else {
        this.$message.error(msg)
      }
    }
  },

  // 局部注册一个  eltreeGrid组件
  components: {
    'el-table-tree-column': ElTreeGrid
  }
}
