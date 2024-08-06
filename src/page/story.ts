import { Application } from "pixi.js"
import { Beater } from "./beater"
import { Databus } from "../databus"

export interface Story {
    ofApp(): Application

    ofData(): Databus

    onPageChanged(page: number): void

    onGameStart(): void

    onGameEnd(): void

    onGridTap(x: number, y: number, beater: Beater): void

    toNextLevel(): void

    toHomePage(): void
}