import { app } from "./routes";
import "dotenv/config"

app.listen(parseInt(process.env["PORT"] || "3000"), ({ port }) => {
    console.log(`Dev server is running at http://localhost:${port}`)
})