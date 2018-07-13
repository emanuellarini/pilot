import React from 'react'
import { action } from '@storybook/addon-actions'
import { identity } from 'ramda'

import Section from '../../../../Section'
import AddAccount from '../../../../../src/containers/AddRecipient/BankAccountStep/AddAccount'

const AddAccountExample = () => (
  <Section>
    <AddAccount
      onContinue={action('Continue')}
      onBack={action('Back')}
      onCancel={action('Cancel')}
      t={identity}
    />
  </Section>
)

export default AddAccountExample
