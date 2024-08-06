import * as PIXI from 'pixi.js'
import * as UX from '../ux';
import { Board } from './board';
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { Story } from './story';
import { Cover } from './cover';

export class ContentPanel implements Page {
    private story: Story

    private app: PIXI.Application

    private board: Board

    private group = new PIXI.Container()

    private endButton = new PIXI.Graphics()

    private chessboard = new PIXI.Graphics()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
        this.board = new Board(story, this.group)
    }

    create(): void {
        this.group.addChild(this.endButton)
        this.group.addChild(this.chessboard)
        this.app.stage.addChild(this.group)
        this.board.create()
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y

        const cover = new Cover(scaffold.width, scaffold.height)
        const x = 8
        const tempY = cover.height - cover.width - cover.yOffset
        const y = tempY / 2 + 16

        const btn = this.endButton
        btn.eventMode = 'static';
        btn.removeAllListeners()
        btn.on('pointertap', () => this.story.onGameEnd())
        this.drawButton(cover, x, y)

        const resume = () => this.drawButton(cover, x, y)
        UX.addBtnEvent(btn, resume, () => this.drawBtnPressed(cover, x, y))

        this.drawChessBoard(scaffold.width, scaffold.height)
        this.board.build(scaffold)
    }

    update(x: number, y: number): void {
        this.group.x = x
        this.group.y = y
    }

    show(): void {
        this.group.visible = true
    }

    hide(): void {
        this.group.visible = false
    }

    clearAnim(): void {
        this.board.clearAnim()
    }

    destory(): void {
        this.board.destory()
        this.endButton.clear()
        this.group.removeChild(this.endButton)
        this.group.removeChild(this.chessboard)
        this.app.stage.removeChild(this.group)
    }

    private drawBtnPressed(cover: Cover, x: number, y: number) {
        this.drawButton(cover, x, y, true)
    }

    private drawButton(cover: Cover, x: number, y: number, isPress = false) {
        const button = this.endButton
        button.clear()

        const size = cover.starSize * 4 / 5
        const bgrColor = isPress ? UX.themeColorPressed : UX.themeColor
        if (isPress) {
            button.filters = UX.shadowPressed()
        } else {
            button.filters = UX.shadowDefault()
        }
        // UX.drawButton(button, btnSize, btnRound, bgrColor)
        button.filletRect(x, y, size, size, size / 4).fill(bgrColor)

        const stickRound = size / 10
        const x1 = x + stickRound * 2.5
        const x2 = x + stickRound * 5.5
        const y0 = y + stickRound * 2 - 0.5
        button.filletRect(x1, y0, stickRound * 2, stickRound * 6, stickRound)
        button.filletRect(x2, y0, stickRound * 2, stickRound * 6, stickRound)
        const stickColor = isPress ? 0xC0C0C0 : 0xFFFFFF
        button.fill(stickColor)
    }

    private drawChessBoard(width: number, height: number) {
        let chessboard = this.chessboard
        chessboard.strokeStyle = {
            color: 0xEEEEEE,
            width: 1,
        }

        const cover = new Cover(width, height)
        const gridY = cover.gridY
        const strokeSize = cover.strokeSize
        const padding = cover.padding
        const gridSize = cover.gridSize
        const strokeHalf = cover.strokeHalf

        chessboard.clear()
        for (let i = 1; i < UX.row; i++) {
            const y = gridY + padding + strokeHalf + i * (gridSize + strokeSize)
            const startX = padding + strokeHalf
            chessboard.moveTo(startX, y)
            const endX = width - padding - strokeHalf
            chessboard.lineTo(endX, y)
        }
        for (let i = 1; i < UX.col; i++) {
            const x = padding + strokeHalf + i * (gridSize + strokeSize)
            const startY = gridY + padding + strokeHalf
            chessboard.moveTo(x, startY)
            const endY = gridY + width - padding - strokeHalf
            chessboard.lineTo(x, endY)
        }
        chessboard.stroke()
    }
}