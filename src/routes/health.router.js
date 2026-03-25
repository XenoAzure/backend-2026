import express from 'express'

import healthController from '../controllers/health.controller.js'

const healthRouter = express.Router()

healthRouter.get(
    '/',
    healthController.getApi
)

healthRouter.get(
    '/page',
    (request, response) => {
        return response.status(200).send(
            `
                <html>
                    <head>
                        <title>Health Check</title>
                    </head>
                    <body>
                        <h1>Health Check</h1>
                        <p>API is running correctly.</p>
                    </body>
                </html>
            `
        )
    }
)

healthRouter.get(
    '/database',
    healthController.getDB
)

export default healthRouter
