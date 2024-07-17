# eggcore

## Command Line
npm create vite@latest
npm run dev
npm run build

npm install @tweenjs/tween.js
npm install

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

