import * as PIXI from 'pixi.js'
import * as UX from "../ux"
import { Size } from "../page/size"

export class TextButton {
    private readonly button = new PIXI.Graphics()

    private readonly text = UX.createText()

    private readonly args = [UX.themeColor, 0xE5AC00, 0xFFFFFF, 0xDDDDDD]

    private btnDown = () => { }

    private btnUp = () => { }

    public addToGroup(group: PIXI.Container) {
        group.addChild(this.button)
        group.addChild(this.text)
    }

    public create(content: String, tap: () => void) {
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

        const button = this.button
        button.eventMode = 'static';
        button.removeAllListeners()
        button.on('pointertap', tap)
        UX.addBtnEvent(button, () => this.btnDown(), () => this.btnUp())
    }

    public draw(size: Size, round: number, args: Array<PIXI.FillInput> = this.args) {
        const btnColor = args[0]
        const btnColorPress = args[1]
        const textColor = args[2]
        const textColorPress = args[3]

        const button = this.button
        button.filters = [UX.defaultShadow()]
        const btnRound = round
        UX.drawButton(button, size, btnRound, btnColor)
        this.text.style.fill = textColor
        this.btnDown = () => {
            UX.drawButton(button, size, btnRound, btnColorPress)
            this.text.style.fill = textColorPress
        }
        this.btnUp = () => {
            UX.drawButton(button, size, btnRound, btnColor)
            this.text.style.fill = textColor
        }

        this.text.x = size.x + size.width / 2
        this.text.y = size.y + size.height / 2
    }

    public removeFromView(group: PIXI.Container) {
        this.button.clear()
        group.removeChild(this.button)
        group.removeChild(this.text)
    }
}