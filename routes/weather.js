const express = require('express')
const router = express.Router()
const needle = require("needle") 
const url = require("url")
const apicache = require("apicache")

// Env Variables
const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// Initialize cache
let cache = apicache.middleware //For cache control

router.get("/", cache("2 minutes"), async (req, res) => {
  try {
    const params = new URLSearchParams({
        [API_KEY_NAME] : API_KEY_VALUE, ...url.parse(req.url, true).query // Addingthe city the user request for in the query using spread operator
    })

    //THIS IS HOW THE ORIGINAL API CALL LOOKS LIKE FROM OPENWEATHERMAP.ORG: "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}", BUT WE'VE BROKEN IT DOWN INTO COMPONENTS LIKE: API_BASE_URL, KEY_NAME

      // const apiResponse = await needle("get", `${API_BASE_URL}?${API_KEY_NAME}=${API_KEY_VALUE}`)
    const apiResponse = await needle("get", `${API_BASE_URL}?${params}`) //modernise way of writing the above
    const data = apiResponse.body

    console.log(data);
    // Log the request to the public API
    if (process.env.NODE_ENV !== "production") {
        console.log(`Your Request URL is: ${API_BASE_URL}?${params}`);
    }

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router