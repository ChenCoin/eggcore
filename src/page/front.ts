import { Scaffold } from "./scaffold"
import { Page } from "./page"
import * as PIXI from 'pixi.js'
import * as UX from "../ux"
import { Size } from "./size"
import { Story } from "./story"

export class FrontPanel implements Page {
    private app: PIXI.Application

    private story: Story

    private group = new PIXI.Container()

    private startButton = new PIXI.Graphics()

    private title = new PIXI.Text()

    private buttonText = new PIXI.Text()

    constructor(story: Story) {
        this.story = story
        this.app = story.ofApp()
    }

    create(): void {
        this.group.addChild(this.title)
        this.group.addChild(this.startButton)
        this.group.addChild(this.buttonText)
        this.app.stage.addChild(this.group)
        // new object
        // new groups and add object to groups
        // add groups to app stage
        const title = this.title
        const style = new PIXI.TextStyle({
            align: 'center',
            fill: 0xFFFFFF,
            fontFamily: UX.pigFont,
            fontSize: 84,
            stroke: {
                color: UX.themeColor,
                width: 16,
            },
        })
        title.anchor = 0.5
        title.resolution = window.devicePixelRatio
        title.style = style
        title.text = UX.title

        const btnText = this.buttonText
        const btnTextStyle = new PIXI.TextStyle({
            align: 'center',
            fill: 0xFFFFFF,
            fontFamily: UX.textFont,
            fontSize: 24,
        })
        btnText.anchor = 0.5
        btnText.resolution = window.devicePixelRatio
        btnText.style = btnTextStyle
    }

    build(scaffold: Scaffold): void {
        this.group.x = scaffold.x
        this.group.y = scaffold.y
        const padding = 48

        const title = this.title
        title.x = scaffold.width / 2
        title.y = scaffold.height / 2 - padding * 2

        const x = padding * 2
        const y = scaffold.height / 2 + padding * 2
        const width = scaffold.width - padding * 4
        const height = 48

        const btnText = this.buttonText
        btnText.text = UX.startGame
        btnText.x = scaffold.width / 2
        btnText.y = y + height / 2

        const button = this.startButton
        button.filters = [UX.defaultShadow()]
        button.eventMode = 'static';
        button.removeAllListeners()
        button.on('pointertap', () => this.story.onGameStart())
        const btnSize = new Size(x, y, width, height)
        const btnRound = 24
        UX.drawButton(button, btnSize, btnRound, UX.themeColor)
        const normalEvent = () => {
            UX.drawButton(button, btnSize, btnRound, UX.themeColor)
            btnText.style.fill = 0xFFFFFF
        }
        UX.addButtonEvent(button, normalEvent, () => {
            UX.drawButton(button, btnSize, btnRound, 0xE5AC00)
            btnText.style.fill = 0xDDDDDD
        })
    }

    update(x: number, y: number): void {
        this.group.x = x
        this.group.y = y
    }

    show(): void {
        this.group.visible = true
    }

    hide(): void {
        this.group.visible = false
    }

    destory(): void {
        // remove groups from app stage
        // groups to be null
        this.startButton.clear()
        this.group.removeChild(this.startButton)
        this.app.stage.removeChild(this.group)
    }
}