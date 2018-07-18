import {
  applyMiddleware,
  createStore,
} from 'redux'
import {
  save,
  load,
} from 'redux-localstorage-simple'

import { createEpicMiddleware } from 'redux-observable'

import { rootEpic, rootReducer } from '../pages/actions'

const states = [
  'account.sessionId',
  'anticipation.bulkId',
]

const store = createStore(
  rootReducer,
  load({ states }),
  applyMiddleware(
    createEpicMiddleware(rootEpic),
    save({ states })
  )
)
export default store
