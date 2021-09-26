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
        app.get('/cv', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('cv.html'))
        })
        app.get('/admin', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('post.html'))
        })
        app.get('/login', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('auth.html'))
        })

        app.get('/1', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('img.html'))
            Utilities.log('note', 'Someone visited img 1.')
        })
        app.get('/2', (req: Request, res: Response) => {
            res.sendFile(Utilities.getView('2.html'))
            Utilities.log('note', 'Someone visited img 2.')
        })
    }
}



