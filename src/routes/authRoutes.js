import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prism from '../../prismaClient.js'

const router = express.Router()

// Resgister a new user /auth/register
router.post('/register', async (req, res) => {
const { username, password } = req.body
  //save username and irreversibly encryted password

  //encrypt the password
const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to the db
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        // now that we have a user, I want to add their first todo for them
        const defaultTodo = `Hello :) Add your first todo!`
        await prism.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })
        // create a token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', async (req, res) => {
  //we get he email and look up to password assciated with email in th db
  //but we get it back encrypted so we cannot compare it to the
  //one the user just entered so we encrypt the password using the exact same algo

const { username, password } = req.body

    try {
        const user = await prism.user.findUnique({
            where: {
                username: username
            }
        })
        // if we cannot find a user associated with that username, return out from the function
        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        // if the password does not match, return out of the function
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user)

        // then we have a successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router
