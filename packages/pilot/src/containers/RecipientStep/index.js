/* eslint-enable */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Col,
  FormCheckbox,
  FormDropdown,
  FormInput,
  Grid,
  RadioGroup,
  Row,
} from 'former-kit'
import {
  CPF,
  CNPJ,
} from 'cpf_cnpj'
import {
  times,
  identity,
  merge,
} from 'ramda'
import recipientTypes from '../../models/recipientTypes'
import styles from './style.css'

function required (value) {
  return value ? false : this.props.t('pages.recipients.identification.error_required_value')
}

// const required = t => value => (value ? false : t('
// pages.recipients.identification.error_required_value'))

function validateCpf (cpf) {
  return CPF.isValid(cpf) ? false : this.props.t('pages.recipients.identification.error_validate_cpf')
}

function validateCnpj (cnpj) {
  return CNPJ.isValid(cnpj) ? false : this.props.t('pages.recipients.identification.error_validate_cnpj')
}

function validateEmail (email) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(email) ? false : this.props.t('page.recipients.identification.error_validate_email')
}

function validatePhone (phone) {
  return phone.match(/\d/g).length === 11 ? false : this.props.t('page.recipients.identification.error_validate_phone')
}

// function isNumber (value) {
//   return Number.isNaN(value) ? false : 'Este campo precisa ser um número'
// }

class RecipientStep extends Component {
  constructor (props) {
    super(props)
    this.state = {
      valueRadio: 'physical',
      checked: props.checked,
      valueCheck: '',
      value: 0,
      data: {
        cpfInput: '',
        cnpjInput: '',
        nameCpf: '',
        emailCpf: '',
        urlCpf: '',
        phoneCpf: '',
        nameCnpj: '',
        emailCnpj: '',
        urlCnpj: '',
        phoneCnpj: '',
        dropdownLegal: '',
        partnerName: '',
        partnerCpf: '',
        partnerPhone: '',
      },
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleMaskChange = this.handleMaskChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    // functions de cima
    this.required = required.bind(this) // pq ta la fora
    this.validateCpf = validateCpf.bind(this)
    this.validateCnpj = validateCnpj.bind(this)
    this.validateEmail = validateEmail.bind(this)
    this.validatePhone = validatePhone.bind(this)
  }

  handleChange (event) {
    const { value } = event.target
    this.setState({
      valueRadio: value,
    })
  }

  handleCheck () {
    this.setState({
      checked: !this.state.checked,
    })
  }

  handleMaskChange (event) {
    const val = event.target.value || ''
    this.setState({
      data: merge(
        this.state.data,
        {
          [event.target.name]: val,
        }
      ),
    })
  }

  handleSubmit (data) {
    const newData = { ...data }
    if (this.state.valueRadio === 'legal') {
      newData.cpfInput = ''
      newData.nameCpf = ''
      newData.emailCpf = ''
      newData.urlCpf = ''
      newData.phoneCpf = ''
      if (!this.state.checked) {
        newData.nameCnpj = ''
        newData.emailCnpj = ''
        newData.urlCnpj = ''
        newData.phoneCnpj = ''
        newData.dropdownLegal = ''
        newData.partnerName_0 = ''
        newData.partnerCpf_0 = ''
        newData.partnerPhone_0 = ''
        newData.partnerName_1 = ''
        newData.partnerCpf_1 = ''
        newData.partnerPhone_1 = ''
        newData.partnerName_2 = ''
        newData.partnerCpf_2 = ''
        newData.partnerPhone_2 = ''
        newData.partnerName_3 = ''
        newData.partnerCpf_3 = ''
        newData.partnerPhone_3 = ''
        newData.partnerName_4 = ''
        newData.partnerCpf_4 = ''
        newData.partnerPhone_4 = ''
      }
    } else {
      newData.cnpjInput = ''
      newData.nameCnpj = ''
      newData.emailCnpj = ''
      newData.urlCnpj = ''
      newData.phoneCnpj = ''
      newData.dropdownLegal = ''
      newData.partnerName_0 = ''
      newData.partnerCpf_0 = ''
      newData.partnerPhone_0 = ''
      newData.partnerName_1 = ''
      newData.partnerCpf_1 = ''
      newData.partnerPhone_1 = ''
      newData.partnerName_2 = ''
      newData.partnerCpf_2 = ''
      newData.partnerPhone_2 = ''
      newData.partnerName_3 = ''
      newData.partnerCpf_3 = ''
      newData.partnerPhone_3 = ''
      newData.partnerName_4 = ''
      newData.partnerCpf_4 = ''
      newData.partnerPhone_4 = ''
      if (!this.state.checked) {
        newData.nameCpf = ''
        newData.emailCpf = ''
        newData.urlCpf = ''
        newData.phoneCpf = ''
      }
    }

    this.setState({ data: newData })
  }

  render () {
    console.log(this.state.data)
    console.log(this.props)
    const {
      disabled,
      error,
      name,
      numbers,
      quantitySelected,
      maskCpf,
      maskCnpj,
      maskPhone,
      t,
    } = this.props

    const {
      valueRadio,
      valueCheck,
      checked,
    } = this.state

    return (
      <div>
        <Form
          data={this.state.data}
          onChange={data => this.setState({
            data,
            value: Number(data.dropdownLegal),
          })}
          onSubmit={this.handleSubmit}
          validateOn={'blur' || 'focus'}
          validation={{
            cpfInput: valueRadio === 'physical' ? [this.required, this.validateCpf] : [],
            cnpjInput: valueRadio === 'legal' ? [this.required, validateCnpj] : [],
            nameCpf: checked ? [this.required] : [],
            emailCpf: checked ? [this.required, this.validateEmail] : [],
            urlCpf: checked ? [this.required] : [],
            phoneCpf: checked ? [this.required, this.validatePhone] : [],
            nameCnpj: checked ? [this.required] : [],
            emailCnpj: checked ? [this.validateEmail] : [],
            phoneCnpj: checked ? [this.required, this.validatePhone] : [],
            dropdownLegal: '',
            partnerName_0: checked ? [this.required] : [],
            partnerCpf_0: checked ? [this.required, this.validateCpf] : [],
            partnerPhone_0: checked ? [this.required, this.validatePhone] : [],
            partnerName_1: checked ? [this.required] : [],
            partnerCpf_1: checked ? [this.required, this.validateCpf] : [],
            partnerPhone_1: checked ? [this.required, this.validatePhone] : [],
            partnerName_2: checked ? [this.required] : [],
            partnerCpf_2: checked ? [this.required, this.validateCpf] : [],
            partnerPhone_2: checked ? [this.required, this.validatePhone] : [],
            partnerName_3: checked ? [this.required] : [],
            partnerCpf_3: checked ? [this.required, this.validateCpf] : [],
            partnerPhone_3: checked ? [this.required, this.validatePhone] : [],
            partnerName_4: checked ? [this.required] : [],
            partnerCpf_4: checked ? [this.required, this.validateCpf] : [],
            partnerPhone_4: checked ? [this.required, this.validatePhone] : [],
          }}
        >
          <Card>
            <CardContent>
              {this.handleChangeLabelCheck}
              <h2>{t('pages.recipients.identification.title')}</h2>
              <h3>{t('pages.recipients.identification.subtitle')}</h3>
              <h3 className={styles.spanRadioBtn}>{t('pages.recipients.identification.type_label')}</h3>
              <RadioGroup
                options={recipientTypes}
                name={name}
                onChange={this.handleChange}
                value={valueRadio}
                disabled={disabled}
                error={error}
              />
              { valueRadio === 'physical' &&
              <div>
                <Grid>
                  <Row>
                    <Col>
                      <FormInput
                        size={30}
                        label={t('pages.recipients.identification.type_label_physical')}
                        name="cpfInput"
                        type="text"
                        maxLength={11}
                        mask={maskCpf}
                        onChange={this.handleMaskChange}
                      />
                      <label htmlFor="cpfInput" />
                    </Col>
                  </Row>
                </Grid>
                <br />
                <br />
                <FormCheckbox
                  label={t('pages.recipients.identification.physical_check_label')}
                  name={name}
                  error={error}
                  disabled={disabled}
                  checked={checked}
                  onChange={this.handleCheck}
                  value={valueCheck}
                />
              </div>
              }
              {valueRadio === 'legal' &&
              <div>
                <Grid>
                  <Row>
                    <Col>
                      <FormInput
                        size={30}
                        label={t('pages.recipients.identification.type_label_legal')}
                        name="cnpjInput"
                        type="text"
                        maxLength={15}
                        mask={maskCnpj}
                        onChange={this.handleMaskChange}
                      />
                      <label htmlFor="cnpjInput" />
                    </Col>
                  </Row>
                </Grid>
                <br />
                <br />
                <FormCheckbox
                  label={t('pages.recipients.identification.legal_check_label')}
                  name={name}
                  error={error}
                  disabled={disabled}
                  checked={checked}
                  onChange={this.handleCheck}
                  value={valueCheck}
                />
              </div>
              }
              <br />
              <br />
              {checked && valueRadio === 'physical' &&
              <div>
                <h2>{t('pages.recipients.identification.physical_title')}</h2>
                <h3>{t('pages.recipients.identification.physical_subtitle')}</h3>
                <Grid>
                  <Row>
                    <Col>
                      <FormInput
                        label={t('pages.recipients.identification.physical_name')}
                        size={30}
                        name="nameCpf"
                        value="name"
                        type="text"
                        maxLength={30}
                      />
                      <label htmlFor="nameCpf" />
                    </Col>
                  </Row>
                </Grid>
                <br />
                <Row stretch>
                  <Col
                    desk={2}
                    palm={2}
                    tablet={2}
                    tv={2}
                  >
                    <FormInput
                      label={t('pages.recipients.identification.physical_email')}
                      size={30}
                      name="emailCpf"
                      value="email"
                      type="text"
                      maxLength={50}
                      placeholder="name@email.com"
                    />
                    <label htmlFor="emailCpf" />
                  </Col>
                  <Col
                    desk={2}
                    palm={2}
                    tablet={2}
                    tv={2}
                  >
                    <FormInput
                      label={t('pages.recipients.identification.physical_url')}
                      size={30}
                      name="urlCpf"
                      value="url"
                      type="text"
                      maxLength={50}
                      placeholder="http://www.website.com"
                    />
                    <label htmlFor="urlCpf" />
                  </Col>
                  <Col
                    desk={2}
                    palm={2}
                    tablet={2}
                    tv={2}
                  >
                    <FormInput
                      label={t('pages.recipients.identification.physical_phone')}
                      name="phoneCpf"
                      size={30}
                      value="phone"
                      type="text"
                      mask={maskPhone}
                      onChange={this.handleMaskChange}
                    />
                    <label htmlFor="phoneCpf" />
                  </Col>
                </Row>
              </div>}
              {checked && valueRadio === 'legal' &&
              <div>
                <h2>{t('pages.recipients.identification.legal_title')}</h2>
                <h3>{t('pages.recipients.identification.legal_subtitle')}</h3>
                <Grid>
                  <Row>
                    <Col>
                      <FormInput
                        label={t('pages.recipients.identification.legal_name')}
                        size={30}
                        name="nameCnpj"
                        value="name"
                        type="text"
                        maxLength={50}
                      />
                      <label htmlFor="nameCnpj" />
                    </Col>
                  </Row>
                </Grid>
                <br />
                <Row stretch>
                  <Col
                    desk={2}
                    palm={2}
                    tablet={2}
                    tv={2}
                  >
                    <FormInput
                      label={t('pages.recipients.identification.legal_email')}
                      size={30}
                      name="emailCnpj"
                      value="email"
                      type="text"
                      maxLength={50}
                      placeholder="name@email.com"
                    />
                    <label htmlFor="emailCnpj" />
                  </Col>
                  <Col
                    desk={2}
                    palm={2}
                    tablet={2}
                    tv={2}
                  >
                    <FormInput
                      label={t('pages.recipients.identification.legal_url')}
                      size={30}
                      name="urlCnpj"
                      value="url"
                      type="text"
                      maxLength={50}
                      placeholder="http://www.website.com"
                    />
                    <label htmlFor="urlCnpj" />
                  </Col>
                  <Col
                    desk={2}
                    palm={2}
                    tablet={2}
                    tv={2}
                  >
                    <FormInput
                      label={t('pages.recipients.identification.legal_phone')}
                      size={30}
                      name="phoneCnpj"
                      value="phone"
                      type="text"
                      maxLength={50}
                      mask={maskPhone}
                      onChange={this.handleMaskChange}
                    />
                    <label htmlFor="phoneCnpj" />
                  </Col>
                </Row>
                <h2>{t('pages.recipients.identification.legal_partnes_title')}</h2>
                <h3>{t('pages.recipients.identification.legal_partnes_subtitle')}</h3>
                <Grid>
                  <Row>
                    <Col>
                      <FormDropdown
                        options={numbers}
                        name="dropdownLegal"
                        value={quantitySelected}
                        label={t('pages.recipients.identification.legal_partners_label')}
                      />
                    </Col>
                  </Row>
                </Grid>
                <br />
                { times(identity, this.state.value).map(key => (
                  <Fragment
                    key={key}
                  >
                    <Row stretch>
                      <Col
                        desk={2}
                        palm={2}
                        tablet={2}
                        tv={2}
                      >
                        <FormInput
                          maxLength={50}
                          size={30}
                          type="text"
                          label={t('pages.recipients.identification.legal_partners_name')}
                          name={`partnerName_${key}`}
                          value="partnerName"
                        />
                      </Col>
                      <Col
                        desk={2}
                        palm={2}
                        tablet={2}
                        tv={2}
                      >
                        <FormInput
                          maxLength={50}
                          size={30}
                          type="text"
                          label={t('pages.recipients.identification.legal_partners_cpf')}
                          name={`partnerCpf_${key}`}
                          value="partnerCpf"
                          mask={maskCpf}
                          onChange={this.handleMaskChange}
                        />
                      </Col>
                      <Col
                        desk={1}
                        palm={1}
                        tablet={1}
                        tv={1}
                      >
                        <FormInput
                          maxLength={50}
                          size={30}
                          type="text"
                          label={t('pages.recipients.identification.legal_partners_phone')}
                          name={`partnerPhone_${key}`}
                          value="partnerPhone"
                          mask={maskPhone}
                          onChange={this.handleMaskChange}
                        />
                      </Col>
                    </Row>
                  </Fragment>
                )) }
              </div>}
              <br />
            </CardContent>
            <CardActions>
              <Button type="button" fill="outline">{t('pages.recipients.identification.button_cancel')}</Button>
              <Button type="submit" fill="gradient">{t('pages.recipients.identification.button_submit')}</Button>
            </CardActions>
          </Card>
        </Form>
      </div>
    )
  }
}

RecipientStep.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  checked: PropTypes.bool,
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  quantitySelected: PropTypes.string,
  maskCpf: PropTypes.string,
  maskCnpj: PropTypes.string,
  maskPhone: PropTypes.string,
  t: PropTypes.func.isRequired,
}

RecipientStep.defaultProps = {
  name: '',
  disabled: false,
  error: '',
  checked: false,
  quantitySelected: '0',
  maskCpf: '111.111.111-11',
  maskCnpj: '11.111.111/1111-11',
  maskPhone: '(11)11111-1111',
}

export default RecipientStep
