const fetch = require('node-fetch')

const authorizationGithubUrl = client_id => (
  `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=user`
)

const requestGithubToken = async (credentials) => {
  return fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(credentials),
    })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error))
    })
}

const requestGithubUserAccount = token => (
  fetch(`https://api.github.com/user?access_token=${token}`)
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error))
    })
)

const authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials)
  const githubUser = await requestGithubUserAccount(access_token)
  return { ...githubUser, access_token}
}

module.exports = {
  authorizationGithubUrl: authorizationGithubUrl,
  authorizeWithGithub: authorizeWithGithub
}
