const { GraphQLScalarType } = require('graphql')

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
    "githubUser": "pochi",
    "created": "3-28-1977"
  },
  {
    "id": "2",
    "name":"Tokyo Tower",
    "description":"High Tower",
    "category": "LANDSCAPE",
    "githubUser": "pochi",
    "created": "3-28-1977"
  },
  {
    "id": "3",
    "name":"Paris",
    "description":"Paris cute!",
    "category": "LANDSCAPE",
    "githubUser": "uni",
    "created": "3-28-1977"
  },
  {
    "id": "4",
    "name":"Gaisenmon",
    "description":"nazo",
    "category": "LANDSCAPE",
    "githubUser": "uni",
    "created": "3-28-2000"
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
    allPhotos: (parent, args) => {
      return photos
    }
  },
  Mutation: {
    postPhoto(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date()
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
  },
  DateTime: new GraphQLScalarType({
    name: `DateTime`,
    description: `A valid date time value.`,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
}

module.exports = resolvers
