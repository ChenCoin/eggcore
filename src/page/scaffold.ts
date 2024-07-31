import { Renderer } from "pixi.js";
import { Cover } from "./cover";

export class Scaffold {
    public readonly x: number;

    public readonly y: number;

    public readonly width: number;

    public readonly height: number;

    private readonly cover: Cover

    constructor(fullWidth: number, fullHeight: number) {
        let width = fullWidth
        let height = fullHeight
        if (width * 16 > height * 10) {
            width = height * 10 / 16
        } else {
            height = width * 16 / 10
        }
        this.x = (fullWidth - width) / 2
        this.y = (fullHeight - height) / 2
        this.width = width
        this.height = height
        this.cover = new Cover(width, height)
    }

    static fromRenderer(renderer: Renderer): Scaffold {
        let width = Math.max(renderer.width, 300)
        let height = Math.max(renderer.height, 480)
        return new Scaffold(width, height)
    }

    public equals(other: Scaffold) {
        return this.x == other.x && this.y == other.y &&
            this.width == other.width && this.height == other.height
    }

    public notEquals(other: Scaffold) {
        return !this.equals(other)
    }

    public sameSize(other: Scaffold) {
        return this.width == other.width && this.height == other.height
    }

    public ofCover(): Cover {
        return this.cover
    }
}