
import { DropShadowFilter } from "pixi-filters"
import { Size } from "./page/size"
import { FillInput, Graphics } from "pixi.js"

export class UX {
    public static readonly row = 10

    public static readonly col = 10

    public static readonly title = '星星王国'

    public static readonly startGame = '开始游戏'

    public static defaultShadow(): DropShadowFilter {
        let filter = new DropShadowFilter()
        filter.color = 0x404040
        filter.alpha = 0.5
        filter.antialias = 'on'
        filter.resolution = window.devicePixelRatio
        return filter
    }

    public static drawButton(btn: Graphics, size: Size, round: number, style: FillInput) {
        btn.clear()
        btn.roundRect(size.x, size.y, size.width, size.height, round)
        btn.fill(style)
    }

    public static addButtonEvent(btn: Graphics, normal: () => void, press: () => void) {
        btn.on('pointerdown', () => press())
        btn.on('pointerup', () => normal())
        btn.on('pointerupoutside', () => normal())
    }
}
