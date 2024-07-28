import * as UX from "../ux"

export class Cover {
    readonly width: number
    readonly height: number
    readonly yOffset: number = 120
    readonly gridY: number
    readonly strokeSize: number
    readonly padding: number = 4
    readonly contentWidth: number
    readonly gridSize: number
    readonly strokeHalf: number
    readonly starPadding: number
    readonly starSize: number
    readonly outerR: number
    readonly innerR: number
    readonly fillet: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        this.gridY = height / 2 - width / 2 + this.yOffset / 2
        this.strokeSize = 1
        this.contentWidth = width - this.padding * 2
        const cw = this.contentWidth
        this.gridSize = (cw - this.strokeSize * (UX.col + 1)) / UX.col
        this.strokeHalf = this.strokeSize / 2

        this.starPadding = this.gridSize / 24
        this.starSize = this.gridSize - this.starPadding * 2
        this.outerR = this.starSize * 15 / 32
        this.innerR = this.outerR * 18 / 32
        this.fillet = this.starSize / 5
    }
}