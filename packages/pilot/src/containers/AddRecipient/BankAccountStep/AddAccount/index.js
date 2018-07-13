import React, { Component } from 'react'

import Form from 'react-vanilla-form'
import PropTypes from 'prop-types'

import {
  Button,
  Col,
  FormInput,
  Grid,
  RadioGroup,
  Row,
} from 'former-kit'

import {
  equals,
  isEmpty,
  values,
} from 'ramda'

import createRequiredValidation from '../../../../validation/required'
import createNumberValidation from '../../../../validation/number'

const hasEmptyValues = data => values(data).some(equals(''))

class AddAccount extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        bank: '',
        agency: '',
        account_number: '',
        account_type: 'checking',
        account_name: '',
      },
      formErrors: {},
      disabledSubmit: true,
      validateOn: 'blur',
    }

    const { t: getTranslation } = this.props
    this.getTranslation = getTranslation

    const requiredMessage = getTranslation('pages.???')
    const numberMessage = getTranslation('pages.???')

    const required = createRequiredValidation(requiredMessage)
    const number = createNumberValidation(numberMessage)

    this.formValidators = {
      bank: [required],
      agency: [required, number],
      account_number: [required, number],
      account_type: [required],
      account_name: [required],
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
  }

  onFormSubmit (formData, formErrors = {}) {
    const someErrors = !isEmpty(formErrors)
    const someEmptyFields = hasEmptyValues(formData)
    const shouldDisableSubmit = (someErrors || someEmptyFields)
    const validationMode = (someErrors) ? 'change' : 'blur'

    if (shouldDisableSubmit) {
      this.setState({
        formData,
        formErrors,
        disabledSubmit: shouldDisableSubmit,
        validateOn: validationMode,
      })
    } else {
      this.props.onContinue(formData)
    }
  }

  onFormChange (formData, formErrors = {}) {
    const someErrors = !isEmpty(formErrors)
    const someEmptyFields = hasEmptyValues(formData)
    const shouldDisableSubmit = (someErrors || someEmptyFields)
    const validationMode = (someErrors) ? 'change' : 'blur'

    this.setState({
      formData,
      formErrors,
      disabledSubmit: shouldDisableSubmit,
      validateOn: validationMode,
    })
  }

  render () {
    const accountOptions = [
      {
        name: 'Corrente',
        value: 'checking',
      },
      {
        name: 'Poupança',
        value: 'savings',
      },
    ]

    return (
      <Form
        data={this.state.formData}
        errors={this.state.formErrors}
        validateOn={this.state.validateOn}
        validation={this.formValidators}
        onSubmit={this.onFormSubmit}
        onChange={this.onFormChange}
      >
        <Grid>
          <Row flex>
            <Col>
              <FormInput
                type="text"
                label="Banco"
                name="bank"
                placeholder="Digite o nome do banco"
              />
            </Col>
          </Row>
          <Row flex>
            <Col>
              <FormInput
                type="text"
                label="Agencia sem o digito"
                name="agency"
                placeholder="Digite o numero da agencia sem o digito"
              />
            </Col>
            <Col>
              <FormInput
                type="text"
                label="Conta (com o digito e sem '/' ou '-')"
                name="account_number"
                placeholder="Digite o numero da conta com o digito"
              />
            </Col>
          </Row>
          <Row flex>
            <Col>
              <label htmlFor="account_type">Tipo de conta</label>
              <RadioGroup
                options={accountOptions}
                name="account_type"
              />
            </Col>
          </Row>
          <Row flex>
            <Col>
              <FormInput
                type="text"
                label="Nome da conta"
                name="account_name"
                placeholder="De um nome para esta conta e digite aqui"
              />
            </Col>
          </Row>
          <Row flex>
            <Col>
              <Button
                onClick={this.props.onCancel}
                relevance="low"
                fill="outline"
              >
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button
                onClick={this.props.onBack}
                fill="outline"
              >
                Voltar
              </Button>
            </Col>
            <Col>
              <Button
                type="submit"
                disabled={this.state.disabledSubmit}
              >
                Continuar
              </Button>
            </Col>
          </Row>
        </Grid>
      </Form>
    )
  }
}

AddAccount.propTypes = {
  onContinue: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

AddAccount.defaultProps = {}

export default AddAccount
