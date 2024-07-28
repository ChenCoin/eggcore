import * as PIXI from 'pixi.js'
import { Board } from './board';
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { Size } from './size';
import { Story } from './story';
import * as UX from '../ux';
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
        const y = tempY / 2 + 8

        const button = this.endButton
        button.filters = [UX.defaultShadow()]
        button.eventMode = 'static';
        button.removeAllListeners()
        button.on('pointertap', () => this.story.onPageChanged(0))
        const buttonSize = UX.scoreTextSize - 2
        const btnSize = new Size(x, y, buttonSize, buttonSize)
        const btnRound = 8
        UX.drawButton(button, btnSize, btnRound, 0xFFFFFF)
        const normalEvent = () => {
            UX.drawButton(button, btnSize, btnRound, 0xFFFFFF)
        }
        UX.addButtonEvent(button, normalEvent, () => {
            UX.drawButton(button, btnSize, btnRound, 0xCCCCCC)
        })
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

    destory(): void {
        this.board.destory()
        this.endButton.clear()
        this.group.removeChild(this.endButton)
        this.group.removeChild(this.chessboard)
        this.app.stage.removeChild(this.group)
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