import { NextFunction, Request, Response, Router } from "express";

const route = Router()

interface RequestWithBody extends Request {
  body: { [key: string] : string  | undefined }
}

function authenticated(req: Request, res: Response, next: NextFunction) {
  if(req.session && req.session.loggedIn) {
    next()
    return
  }

  res.status(401).send(`you're not allowed to access at this page`)
}

route.get('/logout', (req: Request, res: Response) => {
  req.session = undefined
  res.redirect('/')
})

route.get('/home', authenticated, (reqL: Request, res: Response) => {
  res.status(200).send(`Welcome!!`)
})

export default route