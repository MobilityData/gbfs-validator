module.exports = {
  outputDir: '../dist/website',
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
        pathRewrite: { '^/.netlify/functions': '' }
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('autoprefixer')]
      }
    }
  }
}
