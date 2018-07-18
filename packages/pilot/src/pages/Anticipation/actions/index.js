import { createAction } from 'redux-actions'

export { default } from './reducer'

export const BULK_CREATED = 'pilot/anticipation/BULK_CREATED'
export const createdBulk = createAction(BULK_CREATED)

export const BULK_UPDATED = 'pilot/anticipation/BULK_UPDATED'
export const updatedBulk = createAction(BULK_UPDATED)

export const BULK_CONFIRMED = 'pilot/anticipation/BULK_CONFIRMED'
export const confirmedBulk = createAction(BULK_CONFIRMED)

export const BULK_DELETED = 'pilot/anticipation/BULK_DELETED'
export const deletedBulk = createAction(BULK_DELETED)
