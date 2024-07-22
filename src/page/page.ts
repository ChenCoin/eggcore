import { Scaffold } from "./scaffold"

export interface Page {
    create(): void

    build(scaffold: Scaffold): void

    show(): void

    hide(): void

    destory(): void
}