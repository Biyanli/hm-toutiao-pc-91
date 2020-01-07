<template>
  <div class="container-image">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮区域 -->
      <div class="btn_box">
        <el-radio-group @change="changeCollect" v-model="filtersParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button @click="openDialog()" style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 图片列表区域 -->
      <div class="img_list" v-for="item in images" :key="item.id">
        <div class="img_item">
          <img :src="item.url" alt />
          <div class="option" v-if="!filtersParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页区域 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="filtersParams.page"
        :page-size="filtersParams.per_page"
        @current-change="changePager"
        :hide-on-single-page="true"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="上传素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        :show-file-list="false"
        :on-success="uploadSuccess"
        name="image"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
export default {
  data () {
    return {
      filtersParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      // 图片列表区域
      images: [],
      total: 0,
      //   控制对话框显示或隐藏
      dialogVisible: false,
      //   预览图
      imageUrl: null,
      //   headers上传
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      }
    }
  },
  created () {
    this.getImages()
  },
  methods: {
    //   上传成功回调函数
    uploadSuccess (res) {
    //   console.log(res) === {data:{url:'图片地址'}}
      // 预览图片
      this.imageUrl = res.data.url
      // 成功的提示
      this.$message.success('上传成功')
      // 2s关闭对话框 更新列表
      window.setTimeout(() => {
        //   关闭对话框
        this.dialogVisible = false
        // 更新列表
        this.getImages()
      }, 2000)
    },
    //   打开对话框
    openDialog () {
      this.dialogVisible = true
    },
    //   删除图片
    async delImage (id) {
      try {
        await this.$http.delete(`user/images/${id}`)
        this.$message.success('删除图片成功')
        this.getImages()
      } catch (e) {
        this.$message.error('删除图片失败')
      }
    },
    //   添加收藏 取消收藏
    async toggleStatus (item) {
      try {
        // 请求
        const {
          data: { data }
        } = await this.$http.put(`user/images/${item.id}`, {
          collect: !item.is_collected
        })
        //   提示
        this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
        // 修改星星的颜色
        //   修改当前图片的数据 is_collected 返回后台返回的值即可
        item.is_collected = data.collect
      } catch (e) {
        this.$message.error('操作失败')
      }
    },
    //   处理切换 全部与收藏
    changeCollect () {
      this.filtersParams.page = 1
      this.getImages()
    },
    // 处理页码改变
    changePager (newPage) {
      this.filtersParams.page = newPage
      this.getImages()
    },
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.filtersParams })
      this.images = data.results
      this.total = data.total_count
    }
  }
}
</script>

<style lang="less" scoped>
.btn_box {
  margin-bottom: 20px;
}
.img_list {
  display: inline-block;
  .img_item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    position: relative;
    margin: 0 10px 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .option {
      height: 30px;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 0;
      bottom: 0;
      line-height: 30px;
      text-align: center;
      span {
        color: #fff;
        margin: 0 20px;
      }
      .red {
        color: red;
      }
    }
  }
}
</style>
