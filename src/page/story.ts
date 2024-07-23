import { Application } from "pixi.js"
import { Databus } from "../databus"

export interface Story {
    ofApp(): Application

    ofData(): Databus

    onPageChanged(page: number): void
}