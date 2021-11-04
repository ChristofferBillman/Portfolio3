/*
 *  Builds project to JS:     npm run build
 *  Builds + starts:          npm run debug
 */
import bcrypt from 'bcrypt'
import bodyParser from 'body-parser'
// colors need to be imported like this, TS complains otherwise.
import 'colors'
import express, { Application, Request, Response } from 'express'
import fs from 'fs'
import { Db, DeleteResult, InsertOneResult, MongoClient, ObjectId } from 'mongodb'
import path from 'path'
import { post } from './post'
import { Routes } from './routes'
import { Utilities } from './utils'

const port: number = 80;

const app: Application = express()
const routes: Routes = new Routes()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))


const secrets = JSON.parse(fs.readFileSync('secrets.json').toString())

const mongoClient = new MongoClient(secrets.connString);
let db: Db

mongoClient.connect()
    .then((success: any) => {
        mongoClient.db("portfolio").command({ ping: 1 });
        db = mongoClient.db("portfolio")
        Utilities.log('success', 'MongoDB successfully connected.')
    })
    .catch((err: any) => {
        Utilities.log('err', 'MongoDB connection failed.');
        Utilities.log('err', err)
    })

routes.init(app)

app.listen(port, () => {
    Utilities.log('success', 'Listening on port ' + port)
})

/* XMLHttpRequests */

/**
 * Create a new post
 */
app.post('/newPost', (req: Request, res: Response) => {

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

/**
 * Retrieve all posts.
 */
app.get('/getPosts', (req: Request, res: Response) => {
    db.collection('posts').find().toArray()
        .then((posts) => {
            res.send(posts)
            Utilities.log('info', 'Sent ' + posts.length + ' posts to a client.')
        })
})

/**
 * Delete post
 */
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
            return
        })
})

/**
 * Edit a post
 */
app.post('/editPost', (req, res) => {

    if (!authenticated(req.body.token as string)) {
        res.send({ edited: 'no_auth' })
        Utilities.log("warn", "Attempt to edit a post without token was made.")
        return
    }

    const updatePost = {
        $set: {
            title: req.body.title,
            body: req.body.body,
            images: (req.body.images as string).split(",") as String[],
            imagePosition: req.body.imagePosition,
            order: req.body.order
        }
    }

    db.collection('posts').updateOne({ _id: new ObjectId(req.body._id as string) }, updatePost)
        .then(result => {
            if (result) {
                if (result.modifiedCount == 0) {
                    Utilities.log('note', 'Tried to edit post, but no matches found or no new data. Db has not been updated.')
                    // Sends 'edited: OK' to client even though this if statement triggered.
                    // May need to be overlooked in future.
                }
                res.send({ edited: 'OK' })
                Utilities.log('info', "Updated one post in DB.")
            }
        })
        .catch(err => {
            Utilities.log('err', 'Something went wrong when updating a post. See stack trace:')
            console.log(err)
        })
})

/**
 * Authentication on login page.
 */
app.get('/auth_result', (req, res) => {

    if (bcrypt.compareSync(req.query.password as string, secrets.adminPassword)) {
        bcrypt.hash(req.query.password as string, 3)
            .then(hash => {
                res.send({ token: hash })
                Utilities.log('success', 'Login to admin page successful. Sending token to client.')
                Utilities.log('warn', 'If this was not you, close db now.')
            })
    }
    else {
        res.send({ err: "Fel lösenord." })
        Utilities.log('warn', 'Attempted login to admin page failed.')
    }
})

/**
 * Checks if the provided token is valid.
 * @param token
 * @returns True if token is valid, otherwise false.
 */
function authenticated(token: string): boolean {
    return bcrypt.compareSync(secrets.adminHash, token)
}

