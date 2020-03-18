import express from 'express'
import graphqlHTTP from 'express-graphql'

import { schema, rootValue } from './api'
import db from './models'

const app = express()
const port = process.env.PORT || 5000

async function startServer() {
  app.use('/graphql', graphqlHTTP({ schema, rootValue, graphiql: true }))
  // authenticate to db
  await db.authenticate()
  console.log('DB Authenticated')
  await db.sync()
  console.log('DB Synced!')
  // start server
  await app.listen(port)
  console.log(`Listening on port ${port}`)
}

startServer()
