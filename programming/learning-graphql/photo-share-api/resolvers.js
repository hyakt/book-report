const { GraphQLScalarType } = require('graphql')
const fetch = require('node-fetch')
const {
  authorizationGithubUrl,
  authorizeWithGithub
} = require('./lib.js')

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
    me: (parent, args, { currentUser }) => currentUser,
    authorizationGithubUrl: () => authorizationGithubUrl(process.env.CLIENT_ID),
    totalPhotos: (parent, args, { db }) => db.collection('photos').estimatedDocumentCount(),
    allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
    totalUsers: (parent, args, { db }) => db.collection('users').estimatedDocumentCount(),
    allUsers: (parent, args, { db }) => db.collection('users').find().toArray()
  },
  Mutation: {
    addFakeUsers: async (root, { count }, { db }) => {
      const randomUserApi = `https://randomuser.me/api?results=${count}`

      const { results } = await fetch(randomUserApi).then(res => res.json())

      const users = results.map(r => ({
        isFake: true,
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar: r.picture.thumbnail,
        githubToken: r.login.sha1
      }))

      await db.collection('users').insert(users)

      return users
    },
    removeFakeUsers: async (root, args, { db }) => {
      try{
        await db.collection('users').remove({isFake: true})
      } catch (err) {
        return false
      }
      return true
    },
    fakeUserAuth: async (parent, { githubLogin }, { db }) => {
      const user = await db.collection('users').findOne({ githubLogin })
      console.log(user)
      if (!user) {
        throw new Error(`Cannnot find user with githubLogin "${githubLogin}"`)
      }
      return {
        token: user.githubToken,
        user: user
      }
    },
    githubAuth: async (parent, { code }, { db }) => {
      const { CLIENT_ID, CLIENT_SECRET } = process.env
      let {
        message,
        access_token,
        avatar_url,
        login,
        name
      } = await authorizeWithGithub({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      })

      if (message){
        throw new Error(message)
      }

      let latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar: avatar_url
      }

      const { ops:[user] } = await db.collection('users').replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true})

      return { user, token: access_token }
    },
    postPhoto: async (parent, args, { db, currentUser }) => {
      if (!currentUser) {
        throw new Error('only an authorized use ca post a photo')
      }
      const newPhoto = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date()
      }
      const { insertedIds } = await db.collection('photos').insert(newPhoto)
      newPhoto.id = insertedIds[0]

      return newPhoto
    }
  },
  Photo: {
    id: parent => parent.id || parent._id,
    url: parent => `http://hyakt.dev/img/${parent._id}.jpg`,
    postedBy: (parent, args, { db }) => {
      console.log(parent)
      return db.collection('users').findOne({ githubLogin: parent.userID })
    }
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
