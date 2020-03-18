import React from 'react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'

import { Button, Card, Icon, Container, Loader } from 'semantic-ui-react'

import ApolloClient from 'apollo-boost'
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks'

import { gql } from 'apollo-boost'

import cn from 'classnames'
import { sample } from 'lodash/fp'

const client = new ApolloClient({
  uri: '/graphql',
})

const LIST_QUERY = gql`
  query getLists {
    lists {
      id
      title
      cards {
        id
        title
        description
      }
    }
  }
`

const ADD_CARD_MUTATION = gql`
  mutation createCard($options: CreateCardOptions!) {
    createCard(options: $options) {
      id
      title
      description
      listId
    }
  }
`
function App() {
  return (
    <ApolloProvider client={client}>
      <Lists />
    </ApolloProvider>
  )
}

function Lists() {
  const { data, loading } = useQuery(LIST_QUERY)
  const [createCard] = useMutation(ADD_CARD_MUTATION, {
    update(cache, { data: { createCard } }) {
      const { lists } = cache.readQuery({ query: LIST_QUERY })
      const updatedList = lists.find(list => list.id === createCard.listId)
      updatedList.cards.push(createCard)
      cache.writeQuery({
        query: LIST_QUERY,
        data: { lists },
      })
    },
  })

  const buildHandleClick = id => () => {
    const title = window.prompt('Add a title')
    const description = title && window.prompt('Add a description')
    description &&
      createCard({
        variables: {
          options: { description, title, listId: id },
        },
      })
  }

  if (!data || loading) return <Loader />
  return (
    <div className="App">
      {data.lists.map(list => (
        <List {...list} onClick={buildHandleClick(list.id)} />
      ))}
    </div>
  )
}

const COLORS = ['blue', 'green', 'red', 'orange']
function List({ id, cards, title, onClick }) {
  return (
    <Container key={id} fluid className="list-container">
      <h2 className={cn('list-title', sample(COLORS))}>{title}</h2>
      <ListCards listId={id} cards={cards} />
      <div className="button-group">
        <Button animated="vertical" className="button" onClick={onClick}>
          <Button.Content hidden>Add A Card</Button.Content>
          <Button.Content visible>
            <Icon name="plus" />
          </Button.Content>
        </Button>
      </div>
    </Container>
  )
}

function ListCards({ listId, cards }) {
  return (
    <Card.Group itemsPerRow={1}>
      {cards.map(card => (
        <Card key={card.id} className="list-card">
          <Card.Content>
            <Card.Header>{card.title}</Card.Header>
            <Card.Description>
              <Icon name="angle left" />
              {card.description}
              <Icon name="angle right" />
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  )
}
export default App
