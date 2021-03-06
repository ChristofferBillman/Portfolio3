import { Request, Response, Application } from 'express'
import { Utilities } from './utils'

export class Routes {

    init(app: Application) {
        app.get('/', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('index.html'))
        })
        app.get('/english', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('english.html'))
        })
        app.get('/projects', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('projects.html'))
        })
        app.get('/mockups', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('mockups.html'))
        })
        app.get('/admin', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('post.html'))
        })
        app.get('/login', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('auth.html'))
        })
    }
}



