import * as PIXI from 'pixi.js'
import * as Tween from '@tweenjs/tween.js'
import { ContentPanel } from './content'
import { Databus } from '../databus'
import { FrontPanel } from './front'
import { Page } from './page'
import { Scaffold } from './scaffold'
import { Shade } from '../shade'
import { Story } from './story'
import * as UX from '../ux'
import { dartMode, defaultIndex } from '../global'

export class Index implements Story {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    private readonly app = new PIXI.Application()

    private readonly databus = new Databus()

    private readonly versionText = new PIXI.Text()

    private readonly frontPanel = new FrontPanel(this)

    private readonly contentPanel = new ContentPanel(this)

    private pageIndex: number = defaultIndex

    private lastPage: Page = new NullPage()

    private scaffoldCache = new Scaffold(0, 0)

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

        // load the fonts. todo zip the font to woff2
        await PIXI.Assets.load('font/pig.otf')
        await PIXI.Assets.load('font/HarmonyOS_Sans_SC_Regular.ttf')

        // init game data
        this.databus.init()
        if (defaultIndex == 1) {
            this.databus.start()
        }

        if (import.meta.env.DEV && dartMode) {
            document.title = 'DEMO'
            new Shade(app).init()
        }
        // 右下角版本信息
        this.addVersionInfo()
        this.onUpdate(Scaffold.fromRenderer(this.app.renderer))
        this.lastPage = this.showOnStatus()
        let renderer = app.renderer
        renderer.addListener("resize", () => this.onUpdate(Scaffold.fromRenderer(renderer)))
    }

    public ofApp(): PIXI.Application {
        return this.app
    }

    public ofData(): Databus {
        return this.databus
    }

    public onPageChanged(page: number) {
        this.pageIndex = page
        this.lastPage.destory()
        let newPage = this.showOnStatus()
        newPage.create()
        newPage.build(this.scaffoldCache)
        this.lastPage = newPage
    }

    public onGameStart(): void {
        this.databus.start()
        this.onPageChanged(1)
    }

    public onGameEnd(): void {
        this.databus.end()
        this.onPageChanged(0)
    }

    private showOnStatus(): Page {
        if (this.pageIndex == 0) {
            return this.frontPanel
        }
        if (this.pageIndex == 1) {
            return this.contentPanel
        }
        return this.frontPanel
    }

    private onUpdate(newScaffold: Scaffold) {
        let page = this.showOnStatus()
        if (newScaffold.sameSize(this.scaffoldCache)) {
            page.update(newScaffold.x, newScaffold.y)
        } else {
            page.destory()
            page.create()
            page.build(newScaffold)
        }
        this.scaffoldCache = newScaffold

        // 右下角版本信息
        const padding = 4
        this.versionText.x = this.app.renderer.width - padding * 4
        this.versionText.y = this.app.renderer.height - padding
    }

    private addVersionInfo() {
        const style = new PIXI.TextStyle({
            align: 'center',
            fill: '#ffffff',
            fontFamily: UX.textFont,
            fontSize: 14,
        })
        this.versionText.anchor = 1
        this.versionText.resolution = window.devicePixelRatio
        this.versionText.text = UX.version
        this.versionText.style = style
        this.app.stage.addChild(this.versionText)
    }
}

class NullPage implements Page {
    create(): void { }
    build(_: Scaffold): void { }
    update(_x: number, _y: number): void { }
    show(): void { }
    hide(): void { }
    destory(): void { }
}