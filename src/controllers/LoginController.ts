import { NextFunction, Request, Response } from 'express'
import { bodyValidator, controller, get, post, use } from './decorators'


@controller('/auth')
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    res.send(`
    <form method="POST">
      <div>
        <label>Email</label>
        <input name="email"/>
      </div>
  
      <div>
        <label>Password</label>
        <input name="password" type="password"/>
      </div>
  
      <button>Login!</button>
    </form>
  `)
  }

  @post('/login')
  @bodyValidator('email', 'password')
  login(req: Request, res: Response) {
    const { email, password } = req.body

    if(email === 'hola@hola.com' && password ==='password') {
      req.session = { loggedIn: true }
      return res.redirect('/')
    }
  
    res.status(401).send('Invalid credentials')
  }
}

