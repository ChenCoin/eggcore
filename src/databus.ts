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

    public onGridTap(x: number, y: number): boolean {
        if (x < 0 || y < 0 || x >= UX.col || y >= UX.row) {
            return false
        }
        let theGrid = this.allGrid[y][x]
        if (theGrid.isEmpty()) {
            return false
        }
        let sameColorGrids = this.findSameColorGrids(theGrid)
        if (sameColorGrids.length <= 1) {
            return false
        }
        // 消除相同颜色的方块
        console.log(`total: ${sameColorGrids.length}`)
        sameColorGrids.forEach(pos => {
            console.log(`grid ${pos[0]} ${pos[1]}`)
            this.allGrid[pos[0]][pos[1]].clear()
        })
        // 方块消除后，上方的方块下落
        for (let i = 0; i < UX.col; i++) {
            let blank = 0
            for (let j = UX.row - 1; j >= 0; j--) {
                if (blank > 0) {
                    this.allGrid[j + blank][i].clone(this.allGrid[j][i])
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
                        this.allGrid[j][i - blank].clone(this.allGrid[j][i])
                        this.allGrid[j][i].clear()
                    }
                }
            }
        }
        // 统计分数
        const gridCount = sameColorGrids.length
        this.score += (gridCount * gridCount * 5)
        return sameColorGrids.length > 1
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

    constructor(value: number) {
        this.value = value
        this.dx = 0
        this.dy = 0
    }

    public randomInit() {
        this.value = Math.ceil(Math.random() * 5)
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
    }

    public isSameColor(other: GridPoint): boolean {
        return this.value == other.value
    }
}