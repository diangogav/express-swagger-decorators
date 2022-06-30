import express, { Request, Response } from 'express'
import cookieSession from 'cookie-session'
import './controllers/LoginController'
import { AppRouter } from './AppRouter'
import swaggerUi from "swagger-ui-express";

const app = express()
app.use(express.urlencoded())
app.use(cookieSession({ keys: ['hello']}))
app.use(AppRouter.getinstance())
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json("Hello World")
})

app.listen(3000, () => {
  console.log(`Server listening at port 3000`)
})