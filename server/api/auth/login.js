const database = require('../../database')
const auth = require('../../auth')
const { responses } = require('../../responses')

module.exports = {
  method: 'post',
  path: '/auth/login',
  requireAuth: false,
  schema: {
    body: {
      type: 'object',
      properties: {
        teamToken: {
          type: 'string'
        },
        ctftimeToken: {
          type: 'string'
        }
      },
      oneOf: [{
        required: ['teamToken']
      }, {
        required: ['ctftimeToken']
      }]
    }
  },
  handler: async ({ req }) => {
    let user
    if (req.body.ctftimeToken !== undefined) {
      const ctftimeData = await auth.token.getData(auth.token.tokenKinds.ctftimeAuth, req.body.ctftimeToken)
      if (ctftimeData === null) {
        return responses.badCtftimeToken
      }
      user = await database.auth.getUserByCtftimeId({ ctftimeId: ctftimeData.ctftimeId })
    } else {
      const uuid = await auth.token.getData(auth.token.tokenKinds.team, req.body.teamToken)
      if (uuid === null) {
        return responses.badTokenVerification
      }
      user = await database.auth.getUserById({ id: uuid })
    }
    if (user === undefined) {
      return responses.badUnknownUser
    }
    const authToken = await auth.token.getToken(auth.token.tokenKinds.auth, user.id)
    return [responses.goodLogin, {
      authToken
    }]
  }
}
