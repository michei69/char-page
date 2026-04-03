export type ImageData = {
    imageUrl: string,
    imageAlt: string,
    caption: string,
    source?: string,
    blurred?: boolean
}
export type ImageDataExtra<T> = {
    data: ImageData,
    extra: T
}

export type TriviaQuestion = {
    question: string,
    type: "MULTICHOICE" | "TRUEFALSE",
    // multichoice
    options?: {
        [label: string]: boolean // true if correct
    },
    // truefalse
    answer?: boolean
}
export type TimelineEntry = {
    title: string,
    description: string,
    date?: Date | string,
    specificTime?: boolean,
    timeReference?: string,
    image?: ImageData // This isnt used at all atm
}

export default class Character {
    id: string = ""
    thumbnailUrl: string = ""
    thumbnailAlt: string = ""
    pfpUrl: string = ""
    name: string = ""
    quote: string = ""
    tags: string[] = []
    traits: {
        [label: string]: string
    } = {}
    description: string = ""
    colorPalette: Array<{
        hex: string,
        label: string
    }> = []
    stats: {
        [label: string]: {
            type: "BAR" | "TEXT" | string,
            // bar
            min?: number,
            max?: number,
            // bar || text
            value?: number | string
        }
    } = {}
    songs: {
        [title: string]: string
    } = {}
    albums: {
        [title: string]: Array<ImageData>
    } = {}
    story: string = ""
    creatorNote: string = ""
    moodBoard: Array<ImageData> = []
    featuredIn: Array<{
        type: string,
        title: string,
        link: string
    }> = []
    relations: Array<{
        charId: string,
        relation: string,
        description: string
    }> = []
    timeline: Array<TimelineEntry> = []
    outfits: Array<ImageDataExtra<{
        season: "SPRING" | "SUMMER" | "AUTUMN" | "WINTER",
        reason: string,
        details: string
    }>> = []
    favorites: Array<ImageDataExtra<{
        reason: string,
        details: string
    }>> = []
    inventory: Array<ImageDataExtra<{
        reason: string,
        details: string
    }>> = []
    lifeStages: Array<ImageData> = []
    attributes: {
        [label: string]: {
            leftSide: string,
            rightSide: string,
            value: number
        }
    } = {}
    trivia: Array<TriviaQuestion> = []
    alignments: {
        [label: string]: {
            top: string,
            bottom: string,
            left: string,
            right: string,
            x: number,
            y: number
        }
    } = {}
    mature: boolean = false
    original: boolean = true
    fandom: boolean = false
    triggerWarning: string = ""
    cssStyling: string = ""
}