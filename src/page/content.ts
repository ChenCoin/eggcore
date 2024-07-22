import * as PIXI from 'pixi.js'
import { Page } from "./page";
import { Scaffold } from "./scaffold";
import { UX } from '../ux';
import { Size } from './size';

export class ContentPanel implements Page {
    private app: PIXI.Application

    private endGame: () => void

    private group = new PIXI.Container()

    private endButton = new PIXI.Graphics()

    constructor(app: PIXI.Application, endGame: () => void) {
        this.app = app
        this.endGame = endGame
    }

    create(): void {
        this.group.addChild(this.endButton)
        this.app.stage.addChild(this.group)
    }

    build(scaffold: Scaffold): void {
        const padding = 48
        const x = scaffold.x + padding * 2
        const y = scaffold.y
        const width = scaffold.width - padding * 4
        const height = 48

        const button = this.endButton
        button.filters = [UX.defaultShadow()]
        button.eventMode = 'static';
        button.removeAllListeners()
        button.on('pointertap', this.endGame)
        UX.drawButton(button, new Size(x, y, width, height), 24, 0xFFC107)
        const normalEvent = () => {
            UX.drawButton(button, new Size(x, y, width, height), 24, 0xFFC107)
        }
        UX.addButtonEvent(button, normalEvent, () => {
            UX.drawButton(button, new Size(x, y, width, height), 24, 0xE5AC00)
        })
    }

    show(): void {
        this.endGame()
    }

    hide(): void {
    }

    destory(): void {
        this.endButton.clear()
        this.group.removeChild(this.endButton)
        this.app.stage.removeChild(this.group)
    }
}