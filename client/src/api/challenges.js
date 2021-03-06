import { request } from './util'

export const getChallenges = () => {
  return request('GET', '/challs')
    .then(resp => resp.data)
}

export const getPrivateSolves = () => {
  return request('GET', '/users/me')
    .then(resp => resp.data.solves)
}

export const submitFlag = (id, flag) => {
  if (flag === undefined || flag.length === 0) {
    return Promise.resolve({
      error: "Flag can't be empty"
    })
  }

  return request('POST', `/challs/${encodeURIComponent(id)}/submit`, {
    flag
  })
    .then(resp => {
      switch (resp.kind) {
        case 'badFlag':
        case 'badAlreadySolvedChallenge':
        case 'badRateLimit':
          return {
            error: resp.message
          }
        case 'goodFlag':
          return {
            error: undefined
          }
      }
    })
}
