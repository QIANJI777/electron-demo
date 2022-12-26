<template>
  <!-- <iframe src="http://ys.uavebit.com:10603/airportDeviceManagement" frameborder="0" id="iframe"></iframe> -->
  <router-view></router-view>
</template>

<script>
export default {
  name: 'setting',
  props: {},
  components: {},
  data() {
    return {}
  },
  methods: {},
  computed: {},
  watch: {},
  mounted() {
    // console.log(1)
    // let iframe = document.getElementById('iframe')
    // iframe.onload = function () {
    //   console.log(1)
    //   let token =
    //     'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTYzODYyOTQsInVzZXJuYW1lIjoiY3VpeCJ9.BrXvMZVx-AROUcSuzFp49y1d4NPDI3Xpc30SpckwzmQ'
    //   let url = 'http://ys.uavebit.com:10603'
    //   console.log(iframe.contentWindow)
    //   iframe.contentWindow.postMessage(token, url)
    // }
  },
}
</script>

<style lang="scss" scoped>
// #iframe {
//   width: 100%;
//   height: 850px;
// }
</style>
