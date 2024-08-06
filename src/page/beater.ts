import { TapEventResult } from "../databus"

export interface Beater {
    breakTapStar(result: TapEventResult): void

    breakAllStar(): void
}