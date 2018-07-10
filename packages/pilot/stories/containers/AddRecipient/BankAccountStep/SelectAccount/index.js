import React, { Component } from 'react'
import Form from 'react-vanilla-form'
import { Button } from 'former-kit'

import Section from '../../../../Section'
import SelectAccount from '../../../../../src/containers/AddRecipient/BankAccountStep/SelectAccount'

const accounts = [
  {
    name: 'My first account',
    id: '1',
  },
  {
    name: 'My second account',
    id: '2',
  },
]

class SelectAccountExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        accountId: '1',
      },
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (formData) {
    this.setState({ formData })
  }

  render () {
    return (
      <Section>
        <Form
          data={this.state.formData}
          onSubmit={this.onSubmit}
        >
          <SelectAccount
            accounts={accounts}
            name="accountId"
            label="Selecione uma conta bancária:"
          />
          <Button type="submit">Submit</Button>
          <pre>{JSON.stringify(this.state.formData)}</pre>
        </Form>
      </Section>
    )
  }
}

export default SelectAccountExample
