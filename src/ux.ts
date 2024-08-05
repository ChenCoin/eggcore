
import { DropShadowFilter } from "pixi-filters"
import { Size } from "./page/size"
import { FillInput, Graphics, Text } from "pixi.js"

export const row: number = 10

export const col: number = 10

export const breakAnimDuration: number = 500

export const themeColor = 0xFFC107

export const themeColorPressed = 0xD49F00

export const pigFont = 'pig'

export const textFont = 'harmony'

export const scoreTextSize = 54

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

export const nextLevel = '下一关'

export const backHome = '回到首页'

export const pass = '通关'

export const levelInfo = (level: number) => `关卡: ${level}`

export const levelTargetInfo = (target: number) => `目标: ${target}`

export function shadowDefault(): DropShadowFilter {
    let filter = new DropShadowFilter()
    filter.color = 0x404040
    filter.alpha = 0.5
    filter.antialias = 'on'
    filter.resolution = window.devicePixelRatio
    return filter
}

export function shadowPressed(): DropShadowFilter {
    let filter = new DropShadowFilter()
    filter.color = 0x404040
    filter.alpha = 0.8
    filter.antialias = 'on'
    filter.resolution = window.devicePixelRatio
    return filter
}

export function drawButton(btn: Graphics, size: Size, round: number,
    style: FillInput) {
    btn.clear()
    btn.filletRect(size.x, size.y, size.width, size.height, round)
    btn.fill(style)
}

export function drawCard(card: Graphics, size: Size, round: number,
    style: FillInput) {
    card.filletRect(size.x, size.y, size.width, size.height, round)
    card.fill(style)
}

export function addBtnEvent(btn: Graphics, up: () => void, down: () => void) {
    btn.on('pointerdown', down)
    btn.on('pointerup', up)
    btn.on('pointerupoutside', up)
}

export function createText(): Text {
    const text = new Text()
    text.resolution = Math.ceil(window.devicePixelRatio)
    return text
}
