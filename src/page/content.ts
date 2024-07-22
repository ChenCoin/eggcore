import * as PIXI from 'pixi.js'
import { Page } from "./page";
import { Scaffold } from "./scaffold";

export class ContentPanel implements Page {
    private app: PIXI.Application

    private startGame: () => void

    private group = new PIXI.Container()

    constructor(app: PIXI.Application, startGame: () => void) {
        this.app = app
        this.startGame = startGame
    }

    create(): void {
        this.app.stage.addChild(this.group)
    }

    build(_: Scaffold): void {
    }

    show(): void {
        this.startGame()
    }

    hide(): void {
    }

    destory(): void {
    }
}