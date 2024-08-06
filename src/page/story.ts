import { Application } from "pixi.js"
import { Databus, TapEventResult } from "../databus"

export interface Story {
    ofApp(): Application

    ofData(): Databus

    onPageChanged(page: number): void

    onGameStart(): void

    onGameEnd(): void

    onGridTap(x: number, y: number, event: (e: TapEventResult) => void): void

    toNextLevel(): void

    toHomePage(): void
}