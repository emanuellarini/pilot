import {
  applyMiddleware,
  createStore,
  compose,
} from 'redux'

import { createEpicMiddleware } from 'redux-observable'
import { save, load } from 'redux-localstorage-simple'

import DevTools from '../DevTools'
import { rootEpic, rootReducer } from '../pages/actions'

const states = [
  'account.sessionId',
  'anticipation.bulkId',
]

const enhancer = compose(
  applyMiddleware(createEpicMiddleware(rootEpic), save({
    states,
  })),
  DevTools.instrument()
)

const store = createStore(rootReducer, load({ states }), enhancer)

export default store
