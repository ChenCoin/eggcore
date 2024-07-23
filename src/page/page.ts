import { Scaffold } from "./scaffold"

export interface Widget {
    create(): void

    build(scaffold: Scaffold): void

    destory(): void
}

export interface Page extends Widget {
    update(x: number, y: number): void

    show(): void

    hide(): void
}