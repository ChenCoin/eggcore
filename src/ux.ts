
import { DropShadowFilter } from "pixi-filters"
import { Size } from "./page/size"
import { FillInput, Graphics } from "pixi.js"

export const row = 10

export const col: number = 10

export const themeColor = 0xFFC107

export const pigFont = 'pig'

export const textFont = 'HarmonyOS_Sans_SC_Regular'

export const scoreTextSize = 48

export const colorMap: Array<[number, number]> = [
    [0xFFFFFF, 0x000000], // white
    [0xEC7062, 0xE74C3C], // red
    [0x5CADE2, 0x5599C7], // blue
    [0xF4CF40, 0xF5B041], // yellow
    [0xAF7AC4, 0xA569BD], // purple
    [0x57D68C, 0x53BE80], // green
]

export const version = 'version 1.6.0'

export const title = '星星王国'

export const startGame = '开始游戏'

export const levelInfo = (level: number) => `关卡: ${level}`

export const levelTargetInfo = (target: number) => `目标: ${target}`

export function defaultShadow(): DropShadowFilter {
    let filter = new DropShadowFilter()
    filter.color = 0x404040
    filter.alpha = 0.5
    filter.antialias = 'on'
    filter.resolution = window.devicePixelRatio
    return filter
}

export function drawButton(btn: Graphics, size: Size, round: number, style: FillInput) {
    btn.clear()
    btn.filletRect(size.x, size.y, size.width, size.height, round)
    btn.fill(style)
}

export function addButtonEvent(btn: Graphics, normal: () => void, press: () => void) {
    btn.on('pointerdown', () => press())
    btn.on('pointerup', () => normal())
    btn.on('pointerupoutside', () => normal())
}
