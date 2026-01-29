import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url' 
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()
const PORT = process.env.PORT || 5003

//get the file path of the url to the module
const __filename= fileURLToPath(import.meta.url)
//get dir name form the file path
const __dirname= dirname(__filename)

//Middleware
app.use(express.json())
//serves the html from the public directory
//tells express to serve all files from the pubic folder as static assets/files
// any req for the css file wll be resolved to the public directory
app.use(express.static(path.join(__dirname,'../public')))

//serving up the html file form the publiv directory
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public','index.html'))
})

//routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})