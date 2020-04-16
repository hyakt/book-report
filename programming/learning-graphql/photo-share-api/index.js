const { ApolloServer } = require('apollo-server')

const typeDefs = `
type Query {
  totalPhotos: Int!
  allPhotos: [Photo!]!
}
type Mutation {
  postPhoto(input: PostPhotoInput!): Photo!
}
enum PhotoCategory {
  SELFIE
  PORTRAIT
  ACTION
  LANDSCAPE
  GRAPHIC
}
type Photo {
  id: ID!
  url: String!
  name: String
  description: String
  category: PhotoCategory!
  postedBy: User!
  taggedUsers: [User!]!
}
input PostPhotoInput {
  name: String!
  category: PhotoCategory=PORTRAIT
  description: String
}
type User {
  githubLogin: ID!
  name: String
  avatar: String
  postedPhotos: [Photo!]!
  inPhotos: [Photo!]!
}
`
var _id = 0

var users = [
  {"githubLogin": "pochi", "name": "fumi"},
  {"githubLogin": "uni", "name": "ayano"}
]

var photos = [
  {
    "id": "1",
    "name":"Skytree",
    "description":"Asakusa! Shitamachi!",
    "category": "LANDSCAPE",
    "githubUser": "pochi"
  },
  {
    "id": "2",
    "name":"Tokyo Tower",
    "description":"High Tower",
    "category": "LANDSCAPE",
    "githubUser": "pochi"
  },
  {
    "id": "3",
    "name":"Paris",
    "description":"Paris cute!",
    "category": "LANDSCAPE",
    "githubUser": "uni"
  },
  {
    "id": "4",
    "name":"Gaisenmon",
    "description":"nazo",
    "category": "LANDSCAPE",
    "githubUser": "uni"
  }
]

var tags = [
  { "photoID": "1", "userID": "uni" },
  { "photoID": "2", "userID": "uni" },
  { "photoID": "3", "userID": "pochi" },
  { "photoID": "4", "userID": "pochi" },
]

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },
  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  Photo: {
    url: parent => `http://hyakt.dev/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
    taggedUsers: parent => tags
      .filter(tag => tag.photoID === parent.id)
      .map(tag => tag.userID)
      .map(userID => users.find(u => u.githubLogin === userID))
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin )
    },
    inPhotos: parent => tags
      .filter(tag => tag.userID === parent.id)
      .map(tag => tag.photoID)
      .map(photoID => photo.find(p => p.id === photoID))
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`GraphQL Service running on ${url}`)
})
