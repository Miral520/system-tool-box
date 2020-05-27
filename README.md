# vue_electron

### 介绍
##### 结合Electron和Vue开发PC端和Mac端软件<br/><br/>

### 安装
```javascript
npm install
```
<br/>

### 启动
##### 需要新建两个终端<br/><br/>
##### 终端1，首先运行
```javascript
npm run serve
```
<br/>

##### 终端2，再运行
```javascript
// 开发环境, 禁用启动动画
npm run win_dev // Windows
npm run mac_dev // Mac

// 生产环境，无devTool, 禁用刷新
npm run win // Windows
npm run mac // Mac
```
<br/>

### 编译
##### 暂时为Vue编译<br/><br/>
```javascript
npm run build
```
<br/>