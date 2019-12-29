<template>
  <el-select
    :value ="value"
    @change ="changeChannel"
    clearable
    placeholder ="请选择"
  >
    <el-option
      v-for="item in channelOptions"
      :key="item.id"
      :label="item.name"
      :value="item.id"
      clearable
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'my-channel',
  //   value: 只读
  props: ['value'],
  data () {
    return {
    //   channelId: null,
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    async getChannelOptions () {
      // 原始数据：res = {data:{message:'',data:{channel:[]}}}
      // 按照结构去解构赋值
      const {
        data: { data }
      } = await this.$http.get('channels')
      this.channelOptions = data.channels
    },
    changeChannel (channelId) {
    //   if (this.filterParams.channel_id === '') { this.filterParams.channel_id = null }
      if (channelId === '') channelId = null
      //   把选择的频道传递给父组件   父组件去修改数据
      this.$emit('input', channelId)
    }

  }
}
</script>

<style lang="less" scoped>
</style>
