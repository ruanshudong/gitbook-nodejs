<template>
  <span v-html="html">
  </span>
</template>

<script >

export default {
  name: 'Page',
  data() {
    return {
      html: ''
    };
  },
  methods: {
    
    fetchData() {

      let page = location.hash;

      this.$ajax
        .getJSON("/api/view", {
          page
        })
        .then((data) => {
          this.html = data.data;
        })
        .catch((err) => {
        });
    },
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  created() {
    this.fetchData();
  },
  mounted() {
  },
}

</script>

<style>
pre {position: relative;margin-bottom: 24px;border-radius: 3px;border: 1px solid #C3CCD0;background: #FFF;overflow: hidden;}
code {display: block;padding: 12px 24px;overflow-y: auto;font-weight: 300;font-family: Menlo, monospace;}
code.has-numbering {margin-left: 21px;}
.pre-numbering {position: absolute;top: 0;left: 0;width: 20px;padding: 12px 2px 12px 0;border-right: 1px solid #C3CCD0;border-radius: 3px 0 0 3px;background-color: #EEE;text-align: right;font-family: Menlo, monospace;font-size: 0.8em;color: #AAA;}

</style>