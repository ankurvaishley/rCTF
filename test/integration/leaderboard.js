const test = require('ava')
const request = require('supertest')
const app = require('../../dist/server/app')

const { responseList } = require('../../dist/server/responses')

test('succeeds with goodLeaderboard', async t => {
  const resp = await request(app)
    .get(process.env.API_ENDPOINT + '/leaderboard/now')
    .query({ limit: 1, offset: 0 })
    .expect('Content-Type', /json/)
    .expect(responseList.goodLeaderboard.status)

  t.is(resp.body.kind, 'goodLeaderboard')
  t.true(Array.isArray(resp.body.data.leaderboard))
})

test('ctftime integration succeeds with goodCtftimeLeaderboard', async t => {
  const resp = await request(app)
    .get(process.env.API_ENDPOINT + '/integrations/ctftime/leaderboard')
    .query({ limit: 1, offset: 0 })
    .expect('Content-Type', /json/)
    .expect(responseList.goodCtftimeLeaderboard.status)

  t.true(Array.isArray(resp.body.standings))
})
