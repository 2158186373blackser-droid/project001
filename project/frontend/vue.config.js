const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭生产环境的 source map（如果你希望调试时看到源文件，可暂时设为 true）
  productionSourceMap: true,

  devServer: {
    port: 8080,
    host: '0.0.0.0',           // 监听所有网络接口
    allowedHosts: 'all',        // 允许所有主机访问（新版要求）
    client: {
      webSocketURL: {
        hostname: '0.0.0.0',   // 或者写你的实际 IP 如 '192.168.0.199'
        port: 8080
      }
    }
  }
})