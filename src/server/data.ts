import fs from "fs"

export default class DataFolder {
    private name: string
    private backup: DataFolder | undefined

    constructor(name: string, backup?: string) {
        this.name = name
        this.backup = backup ? new DataFolder(backup) : undefined
        this.check()
    }

    check(name = "") {
        const n = `${this.name}/${name}`
        if (!fs.existsSync(n)) {
            fs.mkdirSync(n, { recursive: true })
        }
    }
    checkFromFile(name = "") {
        name = name.replaceAll("\\", "/")
        if (name.includes(".")) {
            const n = name.split("/")
            n.pop()
            this.check(n.join("/"))
        } else this.check(name)
    }

    listExt(name = "") {
        this.check(name)
        return fs.readdirSync(`${this.name}/${name}`)
    }
    list(name = "") {
        return this.listExt(name).map(f => {
            const og = f.split(".")
            og.pop()
            return og.join(".")
        })
    }
    listData(name = "") {
        return this.list(name).map(f => this.get(`${name}/${f}`))
    }

    get(name: string) {
        this.checkFromFile(name + ".json")
        const n = `${this.name}/${name}.json`
        if (!fs.existsSync(n)) {
            return null
        }
        return fs.readFileSync(n, "utf-8")
    }
    set(name: string, data: string) {
        this.checkFromFile(name + ".json")
        const n = `${this.name}/${name}.json`
        if (fs.existsSync(n)) {
            const orig = this.get(name)
            if (orig)
                this.backup?.set(name, orig)
        }
        fs.writeFileSync(n, data, { encoding: "utf-8" })
    }
    delete(name: string) {
        this.checkFromFile(name + ".json")
        const n = `${this.name}/${name}.json`
        if (!fs.existsSync(n)) {
            return
        }
        const orig = this.get(name)
        if (orig)
            this.backup?.set(name, orig)
        fs.rmSync(n, { recursive: true })
        return !fs.existsSync(n)
    }
    restore(name: string) {
        if (!this.backup) return false
        const orig = this.backup.get(name)
        if (!orig) return false
        this.set(name, orig)
        return true
    }
}