import { Request, Response } from 'express'
import { bodyValidator, controller, get, post, use } from './decorators'


@controller('/auth')
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    res.status(200).json({})
  }

  @post('/login')
  @bodyValidator('email', 'password')
  login(req: Request, res: Response) {
    const { email, password } = req.body
    res.status(200).send({ email, password })
  }
}

