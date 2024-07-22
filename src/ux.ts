import { DropShadowFilter } from "pixi-filters"

export class UX {
    public static readonly row = 10

    public static readonly col = 10

    public static readonly title = '哈喽世界'

    public static defaultShadow(): DropShadowFilter {
        let filter = new DropShadowFilter()
        filter.color = 0x404040
        filter.alpha = 0.5
        filter.antialias = 'on'
        filter.resolution = window.devicePixelRatio
        return filter
    }
}
