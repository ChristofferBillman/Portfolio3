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

const secrets = JSON.parse(fs.readFileSync('secrets.json').toString())
const uri = secrets.connString
const db = new MongoClient(uri);
let portfolio: Db

db.connect()
    .then((success: any) => {
        db.db("admin").command({ ping: 1 });
        portfolio = db.db("portfolio")
        log('success', 'MongoDB successfully connected.')
    })
    .catch((err: any) => {
        log('', 'MongoDB connection failed.');
        log('err', err)
    })

routes.init(app)

app.listen(port, () => {
    log('success', 'Listening on port ' + port)
})

/* XMLHttpRequests */

// Create a new post.
app.post('/newPost', (req: Request, res: Response) => {

    console.log(!authenticated(req.body.token as string))

    if (!authenticated(req.body.token as string)) {
        res.send({ added: "no_auth" })
        return
    }

    const doc: post = req.body as unknown as post

    portfolio.collection("posts").insertOne(doc)
        .then((result: InsertOneResult) => {
            log('note', 'Inserted one document into DB.')
            res.send({ added: 'OK', _id: result.insertedId })
        })
})

// Retrieve all posts.
app.get('/getPosts', (req: Request, res: Response) => {
    portfolio.collection('posts').find().toArray()
        .then((posts) => {
            res.send(posts)
            log('info', 'Sent ' + posts.length + ' posts to a client.')
        })
})

// Remove a post.
app.get('/deletePost', (req: Request, res: Response) => {

    if (!authenticated(req.query.token as string)) {
        res.send({ deleted: 'no_auth' })
        return
    }

    portfolio.collection('posts').deleteOne({ _id: new ObjectId(req.query._id as string) })
        .then((result: DeleteResult) => {

            if (result.deletedCount == 1) {
                log('note', 'Deleted 1 post from DB.')
                res.send({ deleted: 'OK' })
            }
            else {
                res.send({ deleted: false })
            }
        })
        .catch(err => {
            log('err', 'Error when a post deletion was attempted. See stack trace below:')
            console.log(err)
        })
})

// Edit a post.
app.get('/editPost', (req, res) => {

    if (!authenticated(req.query.token as string)) {
        res.send({ edited: 'no_auth' })
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

    portfolio.collection('posts').updateOne({ _id: new ObjectId(req.query._id as string) }, updatePost)
        .then(result => {
            if (result)
                res.send({ edited: 'OK' })
        })
        .catch(err => {
            console.log(err)
        })
})

// Authenticate
app.get('/auth_result', (req, res) => {

    console.log(secrets.adminPassword)

    if (bcrypt.compareSync(req.query.password as string, secrets.adminPassword)) {
        console.log("OK")
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
/** Prints a message in the console.
 *
 *  @type       The type of message. Controls the appearance of the message in the console.
 *              Allowed types are 'fatal','err','warn','note' and 'success'.
 *  @message    Message to be printed.
 *  @return {void}
 */
function log(type: string, message: any): void {
    switch (type) {
        case 'err':
            console.log('ERR:'.bgWhite.black + ' ' + message.red)
            break;
        case 'fatal':
            console.log('FATAL ERR:'.bgRed.white + ' ' + message.red)
            break;
        case 'warn':
            console.log('WARN:'.bgWhite.black + ' ' + message.yellow)
            break
        case 'note':
            console.log('NOTE:'.bgWhite.black + ' ' + message)
            break
        case 'success':
            console.log('INFO:'.bgWhite.black + ' ' + message.green);
            break
        default:
            console.log('INFO:'.bgWhite.black + ' ' + message)
            break
    }
}

