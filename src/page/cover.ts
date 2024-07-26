import { UX } from "../ux"

export class Cover {
    readonly width
    readonly height
    readonly gridY
    readonly strokeSize = 1
    readonly padding = 4
    readonly contentWidth
    readonly gridSize
    readonly strokeHalf
    readonly starPadding = 3
    readonly starSize
    readonly outerR
    readonly innerR
    readonly fillet = 4

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        this.gridY = Math.ceil(height / 2 - width / 2 + 40)
        this.contentWidth = width - this.padding * 2
        const cw = this.contentWidth
        this.gridSize = (cw - this.strokeSize * (UX.col + 1)) / UX.col
        this.strokeHalf = Math.ceil(this.strokeSize / 2)

        this.starSize = Math.ceil(this.gridSize - this.starPadding * 2)
        this.outerR = Math.ceil(this.starSize / 2)
        this.innerR = Math.ceil(this.outerR * 3 / 5)
    }
}