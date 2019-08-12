export default {
  data() {
    return {
      rolesList: [],
      // 修改对话框的显示与隐藏
      roleEditDialog: false,
      roleEditForm: {
        id: -1,
        roleName: '',
        roleDesc: ''
      },

      // 分配权限对话框的展示与隐藏
      rightsDialog: false,
      // 所有的权限 树形结构
      rightsTree: [],
      defaultProps: {
        // children用来指定使用哪个属性来指定子节点
        children: 'children',
        // label用来指定使用数据中的哪个属性展示树形控制中的每个节点的名字
        label: 'authName'
      },
      // 当前分配权限的角色id
      curRoleId: -1
    }
  },

  created() {
    this.getRolesList()
    this.getAllRightsTree()
  },

  methods: {
    // 0-获取到所有的权限树形结构数据
    async getAllRightsTree() {
      const res = await this.$http.get('/rights/tree')
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rightsTree = data
      }
    },

    // 1-获取角色列表数据
    async getRolesList() {
      const res = await this.$http.get('/roles')
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      }
    },

    // 2-根据角色id删除数据
    // 方法一:
    // delRolesById(id) {
    //   this.$confirm('确认删除该角色吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async () => {
    //       // 发送请求 删除当前角色
    //       const res = await this.$http.delete(`/roles/${id}`)
    //       if (res.data.meta.status === 200) {
    //         const index = this.rolesList.findIndex(
    //           item => item.id === id
    //         )
    //         this.rolesList.splice(index, 1)
    //       }
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       })
    //     })
    // },

    // 方法二:
    async delRolesById(id) {
      try {
        // 等待用户点击确定或取消按钮
        await this.$confirm('确认删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 1-如果点击的是确定按钮，就会执行以下代码
        // 发送请求 删除当前角色
        const res = await this.$http.delete(`/roles/${id}`)
        if (res.data.meta.status === 200) {
          const index = this.rolesList.findIndex(
            item => item.id === id
          )
          this.rolesList.splice(index, 1)
        }
      } catch (error) {
        // 如果点击取消按钮 就会执行以下代码
        // 相当于处理promise的catch
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },

    // 3-展示修改角色对话框
    showRoleEditDialog(curRole) {
      this.roleEditDialog = true

      // 获取到当前角色的数据
      for (const key in this.roleEditForm) {
        this.roleEditForm[key] = curRole[key]
      }
    },

    // 4-修改角色信息
    async editRole() {
      const { id, roleName, roleDesc } = this.roleEditForm
      const res = await this.$http.put(`/roles/${id}`, {
        roleName,
        roleDesc
      })

      const { data, meta } = res.data
      if (meta.status === 200) {
        // 关闭对话框
        this.roleEditDialog = false
        // 更新列表数据
        const editRole = this.rolesList.find(item => item.id === id)
        editRole.roleName = data.roleName
        editRole.roleDesc = data.roleDesc
      }
    },

    // 5-删除指定角色的权限
    async delRoleRightById(roleId, rightId) {
      // console.log('删除', roleId, rightId)
      const res = await this.$http.delete(
        `roles/${roleId}/rights/${rightId}`
      )
      // console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        const curRole = this.rolesList.find(item => (item = roleId))
        curRole.children = data
      }
    },

    // 6-展示权限树形结构对话框  点击分配权限触发
    showRightsDialog(curRoleRights, id) {
      // 展示对话框
      this.rightsDialog = true

      // 暂存当前角色id
      this.curRoleId = id

      // v-if  v-show
      // v-if 控制展示和隐藏，在隐藏的时候 vue是不会渲染这个dom或组件的
      // 由此visible属性  是通过v-if来控制展示和隐藏

      // tree是包裹在dialog中的 而dialog一开始隐藏的,并且dialog隐藏的时候,vue是不会渲染这个dialog组件的
      // 因此 无法通过$refs 来获取到tree

      // 最终获取-->
      // 在$nextTick回调函数中，就可以获取到tree
      // 因为上面通过设置rightDialog=true 将对话框显示出来，但是vue中的dom更新是异步的，所以必须等到dom更新完成后，才能获取到tree
      // 当nextTick回调函数执行的时候 dom就已经更新完成了
      this.$nextTick(() => {
        // 三级菜单id数组
        const level3Ids = []
        curRoleRights.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id)
            })
          })
        })
        // 指定选中节点的id数组
        this.$refs.rightsTree.setCheckedKeys(level3Ids)
      })
    },

    // 7-给角色分配权限
    async assignRights() {
      // 1-获取到当前角色选中的权限id数组

      // 获取全选项
      const checkedKeys = this.$refs.rightsTree.getCheckedKeys()
      // 获取半选项
      const halfCheckedKeys = this.$refs.rightsTree.getHalfCheckedKeys()
      // 将全选和半选合并
      const allcheckedIds = [...checkedKeys, ...halfCheckedKeys]

      const res = await this.$http.post(
        `/roles/${this.curRoleId}/rights`,
        { rids: allcheckedIds.join(',') }
      )

      if (res.data.meta.status === 200) {
        this.rightsDialog = false
        // 分配后重新获取角色列表
        this.getRolesList()
      }
    }
  }
}
