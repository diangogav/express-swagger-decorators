import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import 'reflect-metadata'
import { AppRouter } from '../../AppRouter'
import { MetadataKeys } from './MetadataKeys'
import { Methods } from './Methods'
import fs from 'fs'
import pathResolver from 'path'

function bodyValidators(keys: string): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send('Invalid request')
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(422).send('Invalid request')
        return
      }
    }

    next()

  }
}

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getinstance()
    const buffer = fs.readFileSync(pathResolver.resolve('public/swagger.json'))
    const swaggerDefinition = JSON.parse(buffer.toString())

    for (const key in target.prototype) {
      const routeHandler = target.prototype[key]
      const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key)
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key)
      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || []
      const requiredBodyProps = Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || []
      const validator = bodyValidators(requiredBodyProps)

      if (path) {
        router[method](`${routePrefix}${path}`, ...middlewares, validator, routeHandler)
        if (!swaggerDefinition.paths[path]) {
          swaggerDefinition.paths[path] = {
            [method]: {
              tags: [routePrefix  ]
            },
            consumes: [
              "application/json"
            ],
          }
        }
      }
    }

    
    const exists = swaggerDefinition.tags.find((swaggerPath: any) => swaggerPath.name === routePrefix)
    if (!exists) {
      swaggerDefinition.tags.push({
        "name": routePrefix,
        "description": "Everything about your Pets",
        "externalDocs": {
          "description": "Find out more",
          "url": "http://swagger.io"
        }
      })
    }

    const toSave = JSON.stringify(swaggerDefinition)
    fs.writeFileSync(pathResolver.resolve('public/swagger.json'), toSave)
  }
}