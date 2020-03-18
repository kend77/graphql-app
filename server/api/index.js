import { buildSchema } from 'graphql'
import db from '../models'

const { list: List, card: Card } = db.models

function stringToArray(str, delimiter) {
  return str.split(delimiter)
}

function mapSequelizeResults(results, mapper) {
  return results.map(res => {
    return mapper(res.dataValues)
  })
}

function queryFieldsInclude({ operation }, field) {
  const selections =
    operation.selectionSet.selections[0].selectionSet.selections
  return selections.find(
    ({ kind, name }) => kind === 'Field' && name.value === field
  )
}

const schema = buildSchema(`
  """
  Represents one Card
  """
  type Card {
    id: ID!
    title: String
    description: String
    labels: [String]
    listId: ID!
  }

  type List {
    id: ID!
    title: String
    cards: [Card!]
  }

  type Query {
    card(id: String!): Card
    cards: [Card]
    list(id: String!): List
    lists: [List]
  }

  input CreateCardOptions {
    title: String!
    description: String
    labels: [String!]
    listId: String!
  }


  type Mutation {
    createCard(options: CreateCardOptions): Card!
    createList(title: String): List!
  }
`)

const rootValue = {
  async cards() {
    const found = await Card.findAll()
    return mapSequelizeResults(found, c => ({
      ...c,
      labels: stringToArray(c.labels || '', ';'),
    }))
  },
  card(args) {
    const { id } = args
    return Card.findOne({ id })
  },
  createCard(args) {
    const { title, description, labels, listId } = args.options
    console.log(labels)
    const labelsToSave = labels && labels.join(';')
    return Card.create({ title, description, labels: labelsToSave, listId })
  },
  list(args, _, info) {
    const { id } = args
    const includeCards = queryFieldsInclude(info, 'cards')
    const opts = includeCards ? { include: [{ model: Card }] } : {}
    return List.findOne({ id, ...opts })
  },

  lists: async (_, __, info) => {
    const includeCards = queryFieldsInclude(info, 'cards')
    const opts = includeCards ? { include: [{ model: Card }] } : {}
    return await List.findAll(opts)
  },

  createList({ title }) {
    return List.create({ title })
  },
}

export { schema, rootValue }
