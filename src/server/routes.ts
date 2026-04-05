import Elysia, { t } from "elysia";
import DataFolder from "./data";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { Agent } from "https";

const dataFolder = new DataFolder("data", "backup-data")

const insecureAgent = new Agent({
    rejectUnauthorized: false
});

const s3client = new S3Client({
    region: process.env["S3_REGION"],
    credentials: {
        accessKeyId: process.env["S3_ACCESS_KEY_ID"] || "",
        secretAccessKey: process.env["S3_SECRET_ACCESS_KEY"] || "",
    },
    forcePathStyle: true,
    endpoint: process.env["S3_ENDPOINT"],
    requestHandler: {
        httpAgent: insecureAgent,
        httpsAgent: insecureAgent
    }
})

const uploadFile = async (key: string, body: Buffer | Uint8Array | Blob | string | ReadableStream) => {
    await s3client.send(new PutObjectCommand({
        Bucket: process.env["S3_BUCKET"],
        Key: key,
        Body: body
    }))

    return `${process.env["S3_ENDPOINT"]}/${process.env["S3_BUCKET"]}/${key}`
}
const deleteFile = async (key: string) => {
    await s3client.send(new DeleteObjectCommand({
        Bucket: process.env["S3_BUCKET"],
        Key: key
    }))
}

export const app = new Elysia({ prefix: "/api" })
    .get("/characters", () => {
        const c = dataFolder.listData("characters").map(c => JSON.parse(c ?? "false")).filter(c => c).filter(c => !Array.isArray(c) && Object.keys(c).length > 0).map(c => ({ id: c.id, name: c.name, pfpUrl: c.pfpUrl })).filter(c => c.id && c.name)
        // console.log(c)
        try {
            return {
                success: true,
                data: c
            }
        } catch (e) {
            console.error(e)
            return { success: false, error: e }
        }
    })
    .get("/character/:id", ({ params: { id } }) => {
        try {
            return {
                success: true,
                data: JSON.parse(dataFolder.get(`characters/${id}`) || "{}")
            }
        } catch (e) {
            return { success: false, error: e }
        }
    }, {
        params: t.Object({
            id: t.String()
        })
    })
    .post("/character/:id", ({ body, params: { id } }) => {
        if (!body) return { success: false, error: "No body provided" }
        try {
            dataFolder.set(`characters/${id}`, JSON.stringify(body))
            return { success: true }
        } catch (e) {
            return { success: false, error: e }
        }
    })
    .delete("/character/:id", ({ params: { id } }) => {
        return { success: dataFolder.delete(`characters/${id}`) }
    }, {
        params: t.Object({
            id: t.String()
        })
    })
    .post("/upload", async ({ body }) => {
        if (!body) return { success: false, error: "No body provided" }
        try {
            const url = await uploadFile("characters/" + randomUUID() + "-" + body.file.name, await body.file.bytes())
            return { success: true, url }
        } catch (e) {
            return { success: false, error: e }
        }
    }, {
        body: t.Object({
            file: t.File({})
        })
    })
    .post("/delete", async ({ body }) => {
        if (!body) return { success: false, error: "No body provided" }
        try {
            await deleteFile("characters/" + body.name)
            return { success: true }
        } catch (e) {
            return { success: false, error: e }
        }
    }, {
        body: t.Object({ name: t.String() })
    })
    .get("/character/new/id", async () => {
        let uuid = randomUUID()
        while (dataFolder.get(`characters/${uuid}`)) uuid = randomUUID()
        return { success: true, id: uuid }
    })