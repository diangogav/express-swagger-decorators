import express, { Request, Response } from 'express'
import routes from './routes/loginRoute'
import cookieSession from 'cookie-session'
import './controllers/LoginController'
import { AppRouter } from './AppRouter'

const app = express()
app.use(express.urlencoded())
app.use(cookieSession({ keys: ['hello']}))
app.use(routes)
app.use(AppRouter.getinstance())


app.get('/', (req: Request, res: Response) => {
  if(req.session && req.session.loggedIn) {
    res.send(`
    <div>
      <div>You are logged in </div>
      <a href="/logout">Logout</a>
    </div>
    `)
  } else {
    res.send(`
    <div>
      <div>You are not logged in </div>
      <a href="/login">Login</a>
    </div>
    `)
  }
})

app.listen(3000, () => {
  console.log(`Server listening at port 3000`)
})