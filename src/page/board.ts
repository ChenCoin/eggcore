import * as PIXI from 'pixi.js'
import { Widget } from "./page";
import { Scaffold } from "./scaffold";

export class Board implements Widget {
    private group: PIXI.Container

    private allStar = new PIXI.Graphics()

    private scaffoldCache = new Scaffold(0, 0)

    constructor(group: PIXI.Container) {
        this.group = group
    }

    create(): void {
        this.group.addChild(this.allStar)
    }

    build(scaffold: Scaffold): void {
        this.scaffoldCache = scaffold
        this.draw()
        // add listener
    }

    draw() {
        let path = new PIXI.GraphicsPath()
        this.drawStar(path, 30 + 20, 30, 20, 10, 0)
        // path.clear()
        // path.moveTo(30 + 20, 30)
        // path.star(30 + 20, 30, 5, 20)
        // path.closePath()
        this.allStar.path(path)

        this.allStar.roundRect(30, 60, 75, 75, 10)
        this.allStar.filletRect(30, 140, 75, 75, 10)

        let path2 = new PIXI.GraphicsPath()
        this.drawSmoothRoundRect(path2, 30, 220, 75, 75, 10)
        this.allStar.path(path2)

        this.allStar.fill(0xC0C0C0)
        // path.clear()
        console.log(`draw star`)
        // draw all star

        // add listener of tap

        // rebuild layout
    }

    destory(): void {
        this.group.removeChild(this.allStar)
    }

    private drawStar(path: PIXI.GraphicsPath, dx: number, dy: number, R: number,
        r: number, rot: number) {
        let deg2Rad = (i: number) => (36 * i - rot) / 180 * Math.PI;
        path.clear();
        path.moveTo(dx - Math.sin(deg2Rad(10)) * R, dy - Math.cos(deg2Rad(10)) * R);
        // 沿着10个点绘制路径
        for (let i = 1; i <= 10; i++) {
            let rad = i % 2 == 1 ? r : R;
            let posX = dx - Math.sin(deg2Rad(i)) * rad;
            let posY = dy - Math.cos(deg2Rad(i)) * rad;
            path.lineTo(posX, posY);
        }
        path.closePath()
    }

    // 绘制平滑的圆角矩形
    private drawSmoothRoundRect(path: PIXI.GraphicsPath, left: number, top: number, width: number,
        height: number, radius: number) {
        let n = 4;
        let gap = radius / n;
        let right = left + width;
        let btm = top + height;
        path.clear();
        path.moveTo(left, top + radius);
        path.bezierCurveTo(left, top + gap, left + gap, top, left + radius, top);
        path.lineTo(right - radius, top);
        path.bezierCurveTo(right - gap, top, right, top + gap, right, top + radius);
        path.lineTo(right, btm - radius);
        path.bezierCurveTo(right, btm - gap, right - gap, btm, right - radius, btm);
        path.lineTo(left + radius, btm);
        path.bezierCurveTo(left + gap, btm, left, btm - gap, left, btm - radius);
        path.closePath();
    }
}