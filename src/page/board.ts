import * as PIXI from 'pixi.js'
import { Widget } from "./page";
import { Scaffold } from "./scaffold";

export class Board implements Widget {
    private group: PIXI.Container

    private allStar = new PIXI.Graphics()

    constructor(group: PIXI.Container) {
        this.group = group
    }

    create(): void {
        this.group.addChild(this.allStar)
    }

    build(_: Scaffold): void {
    }

    destory(): void {
        this.group.removeChild(this.allStar)
    }
}