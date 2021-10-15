/*
 *  Bygger till JS:     npm run build
 *  Bygger + startar:   npm run debug
 */
import express, { Application, Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import fs from 'fs'
import { Db, DeleteResult, InsertOneResult } from 'mongodb'
import bcrypt from 'bcrypt'
import { Routes } from './routes'
import { post } from './post'

// Has to be like this, otherwise TS complains.
import 'colors'
const port: number = 80;

const app: Application = express()
const routes: Routes = new Routes()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))

/* Connect to db */
import { MongoClient, ObjectId } from 'mongodb'
import { Utilities } from './utils'

const secrets = JSON.parse(fs.readFileSync('secrets.json').toString())
const uri = secrets.connString
const mongoClient = new MongoClient(uri);
let db: Db

mongoClient.connect()
    .then((success: any) => {
        mongoClient.db("portfolio").command({ ping: 1 });
        db = mongoClient.db("portfolio")
        Utilities.log('success', 'MongoDB successfully connected.')
    })
    .catch((err: any) => {
        Utilities.log('', 'MongoDB connection failed.');
        Utilities.log('err', err)
    })

routes.init(app)

app.listen(port, () => {
    Utilities.log('success', 'Listening on port ' + port)
})

/* XMLHttpRequests */

// Create a new post.
app.post('/newPost', (req: Request, res: Response) => {

    console.log(!authenticated(req.body.token as string))

    if (!authenticated(req.body.token as string)) {
        res.send({ added: "no_auth" })
        Utilities.log("warn", "Attempt to create new post without token was made.")
        return
    }

    const doc: post = req.body as unknown as post

    db.collection("posts").insertOne(doc)
        .then((result: InsertOneResult) => {
            Utilities.log('info', 'Inserted one document into DB.')
            res.send({ added: 'OK', _id: result.insertedId })
        })
})

// Retrieve all posts.
app.get('/getPosts', (req: Request, res: Response) => {
    db.collection('posts').find().toArray()
        .then((posts) => {
            res.send(posts)
            Utilities.log('info', 'Sent ' + posts.length + ' posts to a client.')
        })
})

// Remove a post.
app.get('/deletePost', (req: Request, res: Response) => {

    if (!authenticated(req.query.token as string)) {
        res.send({ deleted: 'no_auth' })
        Utilities.log("warn", "Attempt to delete a post without token was made.")
        return
    }

    db.collection('posts').deleteOne({ _id: new ObjectId(req.query._id as string) })
        .then((result: DeleteResult) => {

            if (result.deletedCount == 1) {
                Utilities.log('info', 'Deleted 1 post from DB.')
                res.send({ deleted: 'OK' })
            }
            else {
                res.send({ deleted: false })
            }
        })
        .catch(err => {
            Utilities.log('err', 'Error when a post deletion was attempted. See stack trace below:')
            console.log(err)
        })
})

// Edit a post.
app.get('/editPost', (req, res) => {

    if (!authenticated(req.query.token as string)) {
        res.send({ edited: 'no_auth' })
        Utilities.log("warn", "Attempt to edit a post without token was made.")
        return
    }

    const updatePost = {
        $set: {
            title: req.query.title,
            body: req.query.body,
            images: (req.query.images as string).split(",") as String[],
            imagePosition: req.query.imagePosition,
            order: req.query.order
        }
    }

    db.collection('posts').updateOne({ _id: new ObjectId(req.query._id as string) }, updatePost)
        .then(result => {
            if (result)
                res.send({ edited: 'OK' })
            Utilities.log('info', "Updated one post in DB.")
        })
        .catch(err => {
            console.log(err)
        })
})

// Authenticate
app.get('/auth_result', (req, res) => {

    console.log(secrets.adminPassword)

    if (bcrypt.compareSync(req.query.password as string, secrets.adminPassword)) {
        bcrypt.hash(req.query.password as string, 3)
            .then(hash => {
                res.send({ token: hash })
            })
    }
    else {
        res.send({ err: "Fel lösenord." })
    }
})

function authenticated(token: string): boolean {
    return bcrypt.compareSync(secrets.adminHash, token)
}

