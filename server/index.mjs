import "./loadEnvironment.mjs"
import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import posts from './routes/posts.mjs'

const PORT = process.env.PORT || 5050
const app = express()

app.use(cors)
app.use(express.json())

// app.use('/posts', posts)

app.use((err, _req, res, next) => {
    res.status(500).send('Uh oh! An unexpected error occured.')
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
