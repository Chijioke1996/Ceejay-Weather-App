require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const { json } = require("body-parser")
const rateLimit = require("express-rate-limit") // This limits the number of request on your endpoints and prevents you from being spammed too many times
const PORT = process.env.PORT || 5000

// Set static folder
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(json())

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // That's 10 minutes
    max: 100 // How many request users can make in 10 minutes
})
app.use(limiter) //middleware

app.set("trust proxy", 1) //using it as a proxy

// Routes
app.use("/api", require("./routes/weather"))
 
app.listen(PORT, (error)=> {
    if (error) {
        console.log(error);
    }
    else {
        console.log(`Server running on ${PORT}`);
    }
})