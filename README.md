# eggcore

## Command Line
```bash
// 创建项目
npm create vite@latest
// dev运行
npm run dev
// 编译打包
npm run build

// 添加依赖库
npm i pixi.js
npm i pixi-filters
npm i @tweenjs/tween.js
// 已添加依赖的情况下，加载依赖库
npm install

https://bun.sh/guides/ecosystem/vite

curl -fsSL https://bun.sh/install | bash

bun create vite my-app
cd my-app
bun install

bunx --bun vite

// fix error of Cannot find module 'bun:test'
bun add bun-types
bun init
```

## 问题与解决

### 1. 分辨率模糊

```typescript
const app = new PIXI.Application()
await app.init({
    antialias: true, // 抗锯齿
    autoDensity: true,
    resizeTo: window, // 大小为全屏
    resolution: window.devicePixelRatio, // 适配缩放的分辨率
})
```

### 2. 窗口大小变化的监听

不要直接监听window的窗口变化，会造成获取到的renderer大小错误。

```typescript
app.renderer.addListener("resize", this.resizeEvent)
```

### 依赖

阴影的依赖库：`npm i pixi-filters`

### 旋转角度

rotate: 0 - 2 * Pi
angle: 0 - 360


## 点击事件

```typescript
// 配置事件模式
button.eventMode = 'static';
button.on('pointerdown', () => {
    // 手指或鼠标按下时的效果
})
button.on('pointerup', () => {
    // 手指或鼠标离开时的效果
})
button.on('pointerupoutside', () => {
    // 手指或鼠标离开时的效果，事件取消
})
button.on('pointertap', (event) => {
    // 点击事件的逻辑
})
```

## 划动事件

## 事件分发
