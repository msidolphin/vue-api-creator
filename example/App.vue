<template>
  <div id="app">
    <el-button type="success" @click="success">success</el-button>
    <el-button type="danger" @click="failed">request failed</el-button>
    <el-button type="warning" @click="responseFailed">response failed</el-button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    success () {
      this.$api('mock/list').then(res => {
        console.log(res)
      }).catch(err => {
        console.error(err)
      })
    },
    failed () {
     this.$api('app/list').then(res => {
        console.log(res)
      }).catch(err => {
        console.error(JSON.parse(JSON.stringify(err)))
      }) 
    },
    responseFailed () {
      this.$api('mock/error').then(res => {
        console.log(res)
      }).catch(err => {
        console.error(JSON.parse(JSON.stringify(err)))
      })
    }
  }
}
</script>