export default {
  data() {
    return {
      query: '',
      current: 1,
      pageSize: 10,
      total: 0,
      goodList: []
    }
  },

  created() {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      const res = await this.$http.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      console.log(res)
      const {meta: {status}, data: {total, goods}} = res.data
      if (status === 200) {
        this.total = total
        this.goodList = goods
      }
    },

    // 列表索引自定义
    indexMethod(index) {
      return (this.current - 1) * this.pageSize + index + 1
    },

    // 分页功能
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getGoodList()
    }
  }
}
