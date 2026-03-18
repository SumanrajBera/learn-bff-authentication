import "dotenv/config"
import connectToDB from "./src/config/database.js"
import app from "./src/app.js"

connectToDB()

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})