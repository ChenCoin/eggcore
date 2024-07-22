import * as PIXI from 'pixi.js'
import * as Tween from '@tweenjs/tween.js'
import { ContentPanel } from './content'
import { FrontPanel } from './front'
import { Page } from './page'
import { Scaffold } from './scaffold'
import { Shade } from '../shade'
import { UX } from '../ux'
import { dartMode } from '../global'

export class Index {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    private readonly app = new PIXI.Application()

    private readonly versionText = new PIXI.Text()

    private readonly frontPanel = new FrontPanel(this.app, this.createStatusFn(1))

    private readonly contentPanel = new ContentPanel(this.app, this.createStatusFn(0))

    private statue: number = 0

    private lastPage: Page = new NullPage()

    private lastScaffold = new Scaffold(0, 0)

    public async start() {
        console.log(`eggcore: app start: ${window.devicePixelRatio}`)
        let app = this.app
        // Wait for the Renderer to be available
        await app.init({
            antialias: true, // 抗锯齿
            autoDensity: true,
            backgroundColor: 0x6495ed,
            resizeTo: window, // 大小为全屏
            resolution: window.devicePixelRatio, // 适配缩放的分辨率
        })
        app.ticker.add(() => Tween.update())
        document.body.appendChild(app.canvas)

        if (import.meta.env.DEV && dartMode) {
            document.title = 'DEMO'
            new Shade(app).init()
        }
        // 右下角版本信息
        this.addVersionInfo()

        this.lastScaffold = Scaffold.fromRenderer(this.app.renderer)
        this.onUpdate(this.lastScaffold)
        this.app.renderer.addListener("resize", () => {
            let newScaffold = Scaffold.fromRenderer(this.app.renderer)
            if (newScaffold.notEquals(this.lastScaffold)) {
                this.lastScaffold = newScaffold
                this.onUpdate(newScaffold)
            }
        })
    }

    private showOnStatus(): Page {
        if (this.statue == 0) {
            return this.frontPanel
        }
        if (this.statue == 1) {
            return this.contentPanel
        }
        return this.frontPanel
    }

    private onUpdate(size: Scaffold) {
        this.lastPage.destory()
        let newPage = this.showOnStatus()
        newPage.create()
        newPage.build(size)
        this.lastPage = newPage

        // 右下角版本信息
        const padding = 4
        this.versionText.x = this.app.renderer.width - padding * 4
        this.versionText.y = this.app.renderer.height - padding
    }

    private createStatusFn(statue: number): () => void {
        return () => {
            this.statue = statue
            this.onUpdate(this.lastScaffold)
        }
    }

    private addVersionInfo() {
        const style = new PIXI.TextStyle({
            fontSize: 16,
            align: 'center',
            fill: '#ffffff',
            stroke: {
                color: 0xCCCCCC,
                width: 1,
            },
        })
        this.versionText.anchor = 1
        this.versionText.text = UX.version
        this.versionText.style = style
        this.app.stage.addChild(this.versionText)
    }
}

class NullPage implements Page {
    create(): void { }
    build(_: Scaffold): void { }
    show(): void { }
    hide(): void { }
    destory(): void { }
}