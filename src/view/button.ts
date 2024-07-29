import * as PIXI from 'pixi.js'
import * as UX from "../ux"
import { Size } from "../page/size"

export class TextButton {
    private button = new PIXI.Graphics()

    private text = UX.createText()

    public addToGroup(group: PIXI.Container) {
        group.addChild(this.button)
        group.addChild(this.text)
    }

    public create(content: String) {
        const btnText = this.text
        const btnTextStyle = new PIXI.TextStyle({
            align: 'center',
            fill: 0xFFFFFF,
            fontFamily: UX.textFont,
            fontSize: 24,
        })
        btnText.anchor = 0.5
        btnText.style = btnTextStyle
        btnText.text = content
    }

    public draw(size: Size, round: number, tap: () => void) {
        const button = this.button
        button.filters = [UX.defaultShadow()]
        button.eventMode = 'static';
        button.removeAllListeners()
        button.on('pointertap', tap)
        const btnRound = round
        UX.drawButton(button, size, btnRound, UX.themeColor)
        const normalEvent = () => {
            UX.drawButton(button, size, btnRound, UX.themeColor)
            this.text.style.fill = 0xFFFFFF
        }
        UX.addButtonEvent(button, normalEvent, () => {
            UX.drawButton(button, size, btnRound, 0xE5AC00)
            this.text.style.fill = 0xDDDDDD
        })

        this.text.x = size.x + size.width / 2
        this.text.y = size.y + size.height / 2
    }

    public removeFromView(group: PIXI.Container) {
        group.removeChild(this.button)
        group.removeChild(this.text)

    }
}