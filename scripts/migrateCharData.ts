import fs from "fs"
import Character from "../src/client/lib/CharacterState"
async function main() {
    for (const file of fs.readdirSync("data/characters")) {
        const data = fs.readFileSync(`data/characters/${file}`, "utf-8")
        const parsed: Character = JSON.parse(data)

        if (Array.isArray(parsed.traits)) {
            console.error(`Skipping ${file} because it has already been migrated`)
            continue
        }

        const origTraits = { ...(parsed.traits as any) }
        const origStats = { ...parsed.stats }
        const origSongs = { ...parsed.songs }
        const origAlbums = { ...parsed.albums }
        const origAttributes = { ...parsed.attributes }
        const origAlignments = { ...parsed.alignments }

        parsed.traits = []
        parsed.stats = []
        parsed.songs = []
        parsed.albums = []
        parsed.attributes = []
        parsed.alignments = []

        for (const [key, val] of Object.entries(origTraits)) {
            parsed.traits.push({
                label: key,
                text: (val as any) + ""
            })
        }
        for (const [key, val] of Object.entries(origStats)) {
            parsed.stats.push({
                label: key,
                ...(val as any)
            })
        }
        for (const [key, val] of Object.entries(origSongs)) {
            parsed.songs.push({
                title: key,
                ...(val as any)
            })
        }
        for (const [key, val] of Object.entries(origAlbums)) {
            parsed.albums.push({
                title: key,
                ...(val as any)
            })
        }
        for (const [key, val] of Object.entries(origAttributes)) {
            parsed.attributes.push({
                label: key,
                ...(val as any)
            })
        }
        for (const [key, val] of Object.entries(origAlignments)) {
            parsed.alignments.push({
                label: key,
                ...(val as any)
            })
        }

        const minified = JSON.stringify(parsed)
        fs.writeFileSync(`data/characters/${file}`, minified, "utf-8")
    }
}
main()