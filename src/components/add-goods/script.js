export default {
  data() {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        // 接收上传成功图片的信息
        pics: [],
        good_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'basic',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },

  async created() {
    // 发送请求 获取数据
    const res = await this.$http.get('categories?type=3')
    const {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.options = data
    }
  },

  methods: {
    change(tab) {
      // console.log(tab)
      // console.log(tab.index)

      // 修改active的值
      this.active = +tab.index
    },

    // 点击  下一步  按钮
    next(active, activeName) {
      this.active = active
      this.activeName = activeName
    },

    // 图片上传成功
    handlerSuccess(response, file, fileList) {
      // 通过response获取到上传成功后的图片地址
      // 存储到this.form.pics
      console.log(response)
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },

    // 删除已上传的图片
    handlerRemove(file) {
      let tmpPath = file.response.data.tmp_path
      // 去数组中找到tmpPath对应的下标
      let idx = this.form.pics.findIndex(item => item.pic === tmpPath)
      this.form.pics.splice(idx, 1)
    },

    // 点击添加按钮
    async addGood() {
      // 发送请求  把收集到的所有数据发送服务端
      const res = await this.$http.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      console.log(res)
      // eslint-disable-next-line standard/object-curly-even-spacing
      const { meta: {status}} = res.data
      if (status === 201) {
        this.$router.push('/goods')
        this.$message.success('添加商品成功')
      }
    }
  }
}
