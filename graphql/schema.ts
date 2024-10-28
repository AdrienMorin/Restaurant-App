export const typeDefs = `
  type Item {
    id: ID
    title: String
    description: String
    price: Float
    imageUrl: String
  }
  
  type Query {
    items: [Item!]!
  }
  
  type Mutation {
    createItem(title: String!, description: String!, price: Float!, imageUrl: String!): Item
    deleteItem(id: ID!): Item
  }
`
