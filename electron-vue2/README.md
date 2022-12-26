# vue2+electron

## 项目说明

### 技术栈
    vue2 + vuex@3.6.2 + vue-router@3.2.0 + vue-cli@4.5.0 + electron@16.0.7 + electron-store@8.0.1 + electron-builder@22.14.5
- node版本：14.17.3

### 项目运行
- 安装依赖
  npm install
- 运行
  npm run serve 
  npm run dev 
- 打包
  npm run build
  npm run pack:win
  npm run pack:mac
- 打包之前
  - src\assets\utils\build_type.js。一共三个功能，切换BUILD_TYPE
  - 运行一次 npm rebuild canvas. 将canvas模块编译一次. 只编译一次即可, 之后无需再编译. 
  
### electron-builder 
  - 配置文件地址
  ```
  C:\Users\fengyu\Desktop\cx-projects\electron\MSElectron\electron-vue2\node_modules\app-builder-lib\scheme.json
  ```