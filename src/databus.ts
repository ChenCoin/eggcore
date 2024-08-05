import * as UX from "./ux"

export class Databus {
    private readonly allGrid = Array<Array<GridPoint>>()

    // 0: front; 1: gaming; 2: pause; 3: end.
    private status: number = 0

    private score: number = 0

    private level: number = 0

    private readonly levelGoals = [1000, 2500, 4000, 5500, 7500, 9000, 11000, 13500, 16500]

    public init() {
        console.log(`data init`)
        for (let i = 0; i < UX.row; i++) {
            this.allGrid[i] = new Array<GridPoint>()
            for (let j = 0; j < UX.col; j++) {
                let grid = new GridPoint(0)
                grid.setPivot(j, i)
                this.allGrid[i][j] = grid
            }
        }
    }

    public start() {
        console.log(`data start`)
        this.loopGrid((grid) => grid.randomInit())

        this.allGrid[0][9].hook(4)
        this.allGrid[1][9].hook(1)
        this.allGrid[2][9].hook(1)
        this.allGrid[3][9].hook(1)
        this.allGrid[4][9].hook(1)

        this.allGrid[3][8].hook(2)
        this.allGrid[4][8].hook(2)
        this.score = 0
        this.status = 1
        this.level = 0
    }

    public end() {
        console.log(`data end`)
        if (this.score >= this.currentLevelTarget()) {
            this.level += 1
            this.status = 3
            this.loopGrid((grid) => grid.randomInit())
        } else {
            this.score = 0
            this.level = 0
            this.status = 4
            this.loopGrid((grid) => grid.clear())
        }
    }

    public ofGrids(): Array<Array<GridPoint>> {
        return this.allGrid
    }

    public ofScore(): number {
        return this.score
    }

    public ofLevel(): String {
        return UX.levelInfo(this.level + 1)
    }

    public ofLevelTarget(): String {
        return UX.levelTargetInfo(this.currentLevelTarget())
    }

    public ofNextBtnText(): String {
        if (this.status == 3) {
            return UX.nextLevel
        }
        return UX.backHome
    }

    public isOnLevelWait(): boolean {
        return this.status == 3
    }

    public isOnLevelFinish(): boolean {
        return this.status == 4
    }

    public onGridTap(x: number, y: number): TapEventResult {
        if (x < 0 || y < 0 || x >= UX.col || y >= UX.row) {
            return TapEventResult.ofNothing()
        }
        const theGrid = this.allGrid[y][x]
        if (theGrid.isEmpty()) {
            return TapEventResult.ofNothing()
        }
        const sameColorGrids = this.findSameColorGrids(theGrid)
        if (sameColorGrids.length <= 1) {
            return TapEventResult.ofNothing()
        }
        // break the grid with same color
        console.log(`total: ${sameColorGrids.length}`)
        const theColor = theGrid.ofColor()
        sameColorGrids.forEach(pos => {
            console.log(`grid ${pos[0]} ${pos[1]}`)
            this.allGrid[pos[0]][pos[1]].clear()
        })
        const movingGrids = this.checkoutMovingStar()
        // 统计分数
        const gridCount = sameColorGrids.length
        this.score += (gridCount * gridCount * 5)
        return TapEventResult.ofBreak(theColor, sameColorGrids, movingGrids)
    }

    public checkIfFinish(): [boolean, number] {
        let count = 0
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                var gridNow = this.allGrid[i][j];
                if (gridNow.isEmpty()) {
                    continue;
                }
                count++
                if (j != UX.col - 1) {
                    var gridRight = this.allGrid[i][j + 1];
                    if (gridNow.isSameColor(gridRight)) {
                        return [false, 0];
                    }
                }
                if (i != UX.row - 1) {
                    var gridBtm = this.allGrid[i + 1][j];
                    if (gridNow.isSameColor(gridBtm)) {
                        return [false, 0];
                    }
                }
            }
        }
        return [true, count];
    }

    // 查找该方块四周相同颜色的方块
    private findSameColorGrids(theGrid: GridPoint): Array<[number, number]> {
        let sameColorGrids = new Array<[number, number]>()
        let pivot = theGrid.getPivot()
        console.log(`node ${pivot[1]} ${pivot[0]}`)
        sameColorGrids.push([pivot[1], pivot[0]])
        let notInclude = (pos: [number, number]): boolean => {
            for (let i = 0; i < sameColorGrids.length; i++) {
                let now = sameColorGrids[i]
                if (now[0] == pos[0] && now[1] == pos[1]) {
                    return false
                }
            }
            return true
        }
        let index = 0
        while (index < sameColorGrids.length) {
            let now = sameColorGrids[index]
            // 上下左右遍历
            let top: [number, number] = [now[0] - 1, now[1]]
            if (top[0] >= 0 && notInclude(top)) {
                let topGrid = this.allGrid[top[0]][top[1]]
                if (topGrid.equals(theGrid)) {
                    sameColorGrids.push(top)
                }
            }
            let bottom: [number, number] = [now[0] + 1, now[1]]
            if (bottom[0] < UX.row && notInclude(bottom)) {
                let bottomGrid = this.allGrid[bottom[0]][bottom[1]]
                if (bottomGrid.equals(theGrid)) {
                    sameColorGrids.push(bottom)
                }
            }
            let left: [number, number] = [now[0], now[1] - 1]
            if (left[1] >= 0 && notInclude(left)) {
                let leftGrid = this.allGrid[left[0]][left[1]]
                if (leftGrid.equals(theGrid)) {
                    sameColorGrids.push(left)
                }
            }
            let right: [number, number] = [now[0], now[1] + 1]
            if (right[1] < UX.col && notInclude(right)) {
                let rightGrid = this.allGrid[right[0]][right[1]]
                if (rightGrid.equals(theGrid)) {
                    sameColorGrids.push(right)
                }
            }
            index++
        }
        return sameColorGrids
    }

    private checkoutMovingStar(): Array<GridPoint> {
        const movingGrids = new Array<GridPoint>()
        // 方块消除后，上方的方块下落
        for (let i = 0; i < UX.col; i++) {
            let blank = 0
            for (let j = UX.row - 1; j >= 0; j--) {
                if (blank > 0) {
                    const grid = this.allGrid[j + blank][i]
                    grid.clone(this.allGrid[j][i])
                    movingGrids.push(grid)
                }
                if (this.allGrid[j][i].isEmpty()) {
                    blank++
                } else if (blank > 0) {
                    this.allGrid[j][i].clear()
                }
            }
        }
        // 某一个列的方块都被消除，则移动右侧的方块
        let blank = 0
        for (let i = 0; i < UX.col; i++) {
            if (this.allGrid[UX.row - 1][i].isEmpty()) {
                blank++
            } else {
                if (blank > 0) {
                    for (let j = 0; j < UX.row; j++) {
                        const grid = this.allGrid[j][i - blank]
                        grid.clone(this.allGrid[j][i])
                        movingGrids.push(grid)
                        this.allGrid[j][i].clear()
                    }
                }
            }
        }
        return movingGrids
    }

    private loopGrid(fn: (grid: GridPoint) => void) {
        for (let i = 0; i < UX.row; i++) {
            for (let j = 0; j < UX.col; j++) {
                fn(this.allGrid[i][j])
            }
        }
    }

    private currentLevelTarget(): number {
        const level = this.level
        const length = this.levelGoals.length
        if (level >= length) {
            return this.levelGoals[length - 1] + 2500 * (level - length + 1);
        }
        return this.levelGoals[level];
    }
}

export class GridPoint {
    private value: number;

    private dx: number

    private dy: number

    private moving: boolean = false

    private position: [number, number] = [0, 0]

    private anim: { x: number } = { x: 0 }

    constructor(value: number) {
        this.value = value
        this.dx = 0
        this.dy = 0
    }

    public randomInit() {
        this.value = Math.ceil(Math.random() * 5)
    }

    public hook(value: number) {
        this.value = value
    }

    public ofColor(): number {
        return this.value
    }

    public getPivot(): [number, number] {
        return [this.dx, this.dy];
    }

    public setPivot(dx: number, dy: number) {
        this.dx = dx
        this.dy = dy
        this.position = [dx, dy]
    }

    public ofPosition(animNum: number): [number, number] {
        const x = this.position[0] + (this.dx - this.position[0]) * animNum
        const y = this.position[1] + (this.dy - this.position[1]) * animNum
        return [x, y]
    }

    public clear() {
        this.value = 0
    }

    public equals(other: GridPoint): boolean {
        return this.value == other.value
    }

    public isEmpty() {
        return this.value == 0
    }

    public clone(other: GridPoint) {
        this.value = other.value
        if (other.moving) {
            this.position = this.checkoutPosition(other)
            console.log(`position ${this.position[0]}, ${this.position[1]}`)
        } else {
            this.position = other.position
        }
    }

    public isSameColor(other: GridPoint): boolean {
        return this.value == other.value
    }

    public startMove(anim: { x: number }) {
        this.moving = true
        this.anim = anim
    }

    public endMove(anim: { x: number }) {
        if (anim != this.anim) {
            return
        }
        this.moving = false
        this.anim = { x: 0 }
        this.position = [this.dx, this.dy]
    }

    public isThisMoveAnim(anim: { x: number }): boolean {
        return this.anim == anim
    }

    public isMoving(): boolean {
        return this.moving
    }

    private checkoutPosition(other: GridPoint): [number, number] {
        const pos = other.position
        const x = pos[0] + (other.dx - pos[0]) * other.anim.x / 1000
        const y = pos[1] + (other.dy - pos[1]) * other.anim.x / 1000
        return [x, y]
    }
}

export class BreakPoint {
    private readonly color: number;

    // data of list item is [y, x, random ... ]
    // the size of random star would be list.length - 2
    private readonly list: Array<Array<number>>

    constructor(color: number, list: Array<Array<number>>) {
        this.color = color
        this.list = list
    }

    public ofColor(): number {
        return this.color
    }

    public ofList(): Array<Array<number>> {
        return this.list
    }
}

export class TapEventResult {
    private readonly isStarBreak: boolean;

    private readonly breakPoint: BreakPoint

    private readonly movingPoint: Array<GridPoint>

    constructor(isBreak: boolean, breaks: BreakPoint, moving: Array<GridPoint>) {
        this.isStarBreak = isBreak
        this.breakPoint = breaks
        this.movingPoint = moving
    }

    public static ofNothing(): TapEventResult {
        return new TapEventResult(false, new BreakPoint(0, []), [])
    }

    public static ofBreak(color: number, list: Array<Array<number>>,
        moving: Array<GridPoint>): TapEventResult {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            const randomSize = Math.random()
            const size = Math.ceil(randomSize * 3)
            for (let i = 0; i < size; i++) {
                const random = Math.random()
                element.push(random)
            }
        }
        return new TapEventResult(true, new BreakPoint(color, list), moving)
    }

    public isBreak(): boolean {
        return this.isStarBreak;
    }

    public ofBreakStar(): BreakPoint {
        return this.breakPoint
    }

    public ofMovingStar(): Array<GridPoint> {
        return this.movingPoint
    }
}