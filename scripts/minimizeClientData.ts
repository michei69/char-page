import fs from "fs"

async function main() {
    for (const file of fs.readdirSync("src/client/data")) {
        const data = fs.readFileSync(`src/client/data/${file}`, "utf-8")
        const parsed = JSON.parse(data)
        const minified = JSON.stringify(parsed)
        fs.writeFileSync(`src/client/data/${file}`, minified, "utf-8")
    }
}
main()