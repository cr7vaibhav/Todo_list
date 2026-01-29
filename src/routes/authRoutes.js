import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// Resgister a new user /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body
    //save username and irreversibly encryted password
    
    //encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    //save the new user and hashed pass to db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username,password)
            VALUES(?,?)`)
        const result = insertUser.run(username, hashedPassword)
        
        // now we have a user I want to add a first todo for them
        const defaultTodo = `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos(user_id ,task)
            VALUES(?,?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)
        
        //create a token
    } catch (error) {
        console.log(error.message)
        res.sendStatus(503)
    }
    
})

router.post('/login', (req, res) => {
    //we get he email and look up to password assciated with email in th db
    //but we get it back encrypted so we cannot compare it to the
    //one the user just entered so we encrypt the password using the exact same algo

})

export default router