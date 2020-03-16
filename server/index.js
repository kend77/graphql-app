import express from "express";
import graphqlHTTP from "express-graphql";
import { buildSchema } from "graphql";
import db from "./db/index";

const app = express();
const port = process.env.PORT || 5000;

const schema = buildSchema(`
  type Card {
    id: ID!
    title: String
    description: String
    labels: [String]
  }
  type Query {
    allCards: [Card]
  }
`);

const root = {
  allCards(args, context, info) {
    console.log(db.models);
    return db.models.card.findAll();
  }
};

const buildModels = async () => await import("./models/index");

async function startServer() {
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true
    })
  );

  await db.authenticate();
  console.log("DB Authenticated");
  await buildModels();
  db.sync();
  console.log("DB Synced!");
  await app.listen(port);
  console.log(`Listening on port ${port}`);
  console.log(db.models);
}

startServer();
