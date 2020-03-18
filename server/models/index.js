import db from './db'
import List from './List'
import Card from './Card'

List.hasMany(Card)

export { List, Card }

export default db
