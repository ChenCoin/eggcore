import { Application } from "pixi.js"
import { Databus, TapEventResult } from "../databus"

export interface Story {
    ofApp(): Application

    ofData(): Databus

    onPageChanged(page: number): void

    onGameStart(): void

    onGameEnd(): void

    onGridTap(x: number, y: number): TapEventResult

    toNextLevel(): void

    toHomePage(): void
}