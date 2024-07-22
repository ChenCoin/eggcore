import * as PIXI from 'pixi.js'

export class Scaffold {
    public readonly x: number;

    public readonly y: number;

    public readonly width: number;

    public readonly height: number;

    constructor(fullWidth: number, fullHeight: number) {
        let width = fullWidth - 20 // 上下5px阴影
        let height = fullHeight - 20 // 上下5px阴影
        if (width * 16 > height * 10) {
            width = height / 16 * 10
        } else {
            height = width / 10 * 16
        }
        this.x = (fullWidth - width) / 2
        this.y = (fullHeight - height) / 2
        this.width = width
        this.height = height
    }

    static fromRenderer(renderer: PIXI.Renderer): Scaffold {
        return new Scaffold(renderer.width, renderer.height)
    }

    public equals(other: Scaffold) {
        return this.x == other.x && this.y == other.y &&
            this.width == other.width && this.height == other.height
    }

    public notEquals(other: Scaffold) {
        return !this.equals(other)
    }
}