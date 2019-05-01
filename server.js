const express = require("express")
const chalk = require("chalk")

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static("client/public"))
app.listen( PORT, _ => console.log(chalk.blue(`Listening on PORT :${PORT}`)) );
