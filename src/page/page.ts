import { Scaffold } from "./scaffold"

export interface Page {
    create(): void

    build(scaffold: Scaffold): void

    update(x: number, y: number): void

    show(): void

    hide(): void

    destory(): void
}