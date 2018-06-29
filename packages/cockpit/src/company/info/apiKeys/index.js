import {
  applySpec,
  juxt,
  pathOr,
} from 'ramda'
import environment from '../../../environment'

const getKeyByPath = path => env => pathOr('', [path, env])

const getApiKey = getKeyByPath('api_key')

const encryptionKey = getKeyByPath('encryption_key')

console.log('environment', environment)

const getApiKeys = env => applySpec({
  apiKey: getApiKey(env),
  encryptionKey: encryptionKey(env),
})

const createApiKey = ({ title, env }) => company => ({
  title,
  keys: getApiKeys(env)(company),
})

export default createApiKey({
  title: environment,
  env: environment,
})
