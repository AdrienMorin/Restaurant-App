export const typeDefs = /* GraphQL */ `
  type Item {
    id: ID
    title: String
    description: String
    price: Float
    imageUrl: String
    orders: [Order!]
  }

  type Table {
    id: ID
    number: Int
    orders: [Order!]
  }

  type Order {
    id: ID
    createdAt: String
    table: Table
    item: Item
    payment: Payment
    status: OrderStatus
  }
  
  enum OrderStatus {
    PENDING
    PREPARING
    READY
    DELIVERED
    PAID
    CANCELLED
   }

  type Payment {
    id: ID
    createdAt: String
    type: PaymentType
    orders: [Order!]!
  }

  enum PaymentType {
    CASH
    CARD
    OTHER
  }

  type AuthPayload {
      token: String
      user: User
  }

  type User {
      id: ID!
      name: String!
      email: String!
      role: Role
      sessions: [Session!]
  }

  enum Role {
      USER
      ADMIN
  }

  type Session {
      id: ID!
      token: String!
      userId: ID!
      user: User!
      expiresAt: String!
  }

  type AuthPayload {
      token: String
      user: User
  }

  type Query {
        me: User!
        users: [User!]!
        user(id: ID!): User
        items: [Item!]!
        getItemById(id: ID!): Item
        tables: [Table!]!
        getTableById(id: ID!): Table
        orders: [Order!]!
        getOrdersByTableId(tableId: ID!): [Order!]
        payments: [Payment!]!
        getPaymentById(id: ID!): Payment
  }

  type Mutation {
        signup(email: String!, password: String!, name: String!, role: Role): AuthPayload
        login(email: String!, password: String!): AuthPayload
        updateUser(id: ID!, name: String, email: String, password: String, role: Role): User
        deleteUser(id: ID!): User
        logout: Boolean
        createItem(title: String!, description: String!, price: Float!, imageUrl: String!): Item
        deleteItem(id: ID!): Item
        editItem(id: ID!, title: String, description: String, price: Float, imageUrl: String): Item
        createOrder(tableId: ID!, itemId: ID!, paymentId: ID): Order
        deleteOrder(id: ID!): Order
        setOrderStatus(id: ID!, status: OrderStatus!): Order
        cancelOrder(id: ID!): Order
        createPaymentForOrder(type: PaymentType!, orderId: ID!): Payment
        createPaymentForTable(type: PaymentType!, tableId: ID!): Payment
        deletePayment(id: ID!): Payment
        addTable: Table
        removeTable: Table
  }
`;
