module.exports = {
  lintOnSave: true, //是否开启eslint保存检测 ,它的有效值为 true || false || 'error'
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/variables.scss";`,
      },
    },
  },
};
