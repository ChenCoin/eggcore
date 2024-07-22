export class Size {
    public readonly x: number;

    public readonly y: number;

    public readonly width: number;

    public readonly height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    static only(width: number, height: number): Size {
        return new Size(0, 0, width, height)
    }
}