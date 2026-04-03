import Elysia, { ElysiaFile, file } from "elysia"
import { existsSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import cors from "@elysiajs/cors"
import { app } from "./routes"

const DIST_DIR = join(process.cwd(), "dist")

function serveStatic(pathname: string): ElysiaFile | undefined {
    let filePath = join(DIST_DIR, pathname)
    const resolvedPath = resolve(filePath)
    if (!resolvedPath.startsWith(resolve(DIST_DIR))) {
        return undefined // or 403
    }

    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
        filePath = join(DIST_DIR, pathname, "index.html")
    }

    if (!existsSync(filePath)) {
        return undefined
    }

    return file(filePath)
}

new Elysia()
    .use(cors())
    .use(app)
    .get("/*", async ({ path }) => {
        if (path.startsWith("/api")) {
            return new Response("Not found", { status: 404 })
        }
        const response = serveStatic(path)
        if (response) return response
        return serveStatic("index.html") || new Response("Not found", { status: 404 })
    })
    .listen(parseInt(process.env["PORT"] || "3000"), ({ port }) => {
        console.log(`Server is running at http://localhost:${port}`)
    })