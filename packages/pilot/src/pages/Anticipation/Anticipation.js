import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  allPass,
  always,
  apply,
  compose,
  cond,
  contains,
  equals,
  head,
  isNil,
  juxt,
  partial,
  path,
  pipe,
  prop,
  pathOr,
  subtract,
} from 'ramda'
import { translate } from 'react-i18next'
import moment from 'moment'
import { Alert } from 'former-kit'
import IconInfo from 'emblematic-icons/svg/Info32.svg'
import {
  confirmedBulk,
  createdBulk,
  deletedBulk,
  updatedBulk,
} from './actions'
import AnticipationContainer from '../../containers/Anticipation'
import env from '../../environment'
import partnersBankCodes from '../../models/partnersBanksCodes'

const mapStateToProps = ({
  account: {
    client,
    company: {
      pricing,
    } = {},
  },
  anticipation: {
    bulkId,
  },
}) => ({
  bulkId,
  client,
  pricing,
})

const mapDispatchToProps = {
  onBulkConfirmed: confirmedBulk,
  onBulkCreated: createdBulk,
  onBulkDeleted: deletedBulk,
  onBulkUpdated: updatedBulk,
}

const getAnticipationLimits = (client, {
  payment_date: paymentDate,
  recipientId,
  timeframe,
}) => (
  client
    .bulkAnticipations
    .limits({
      payment_date: paymentDate.valueOf(),
      recipientId,
      timeframe,
    })
)

const calculateLimits = propName => pipe(
  prop(propName),
  juxt([
    prop('amount'),
    prop('anticipation_fee'),
    prop('fee'),
    prop('fraud_coverage_fee'),
  ]),
  apply(subtract)
)

const calculateMaxLimit = calculateLimits('maximum')
const calculateMinLimit = calculateLimits('minimum')

const createBulk = (client, {
  automaticTransfer,
  paymentDate,
  recipientId,
  requestedAmount,
  timeframe,
}) => (
  client.bulkAnticipations.create({
    automatic_transfer: automaticTransfer,
    build: true,
    payment_date: paymentDate.valueOf(),
    recipientId,
    requested_amount: requestedAmount,
    timeframe,
  })
)

const updateBulk = (client, {
  automaticTransfer,
  bulkId,
  paymentDate,
  recipientId,
  requestedAmount,
  timeframe,
}) => (
  client.bulkAnticipations.update({
    automatic_transfer: automaticTransfer,
    id: bulkId,
    payment_date: paymentDate.valueOf(),
    recipientId,
    requested_amount: requestedAmount,
    timeframe,
  })
)

const confirmBulk = (client, {
  bulkId,
  recipientId,
}) => (
  client.bulkAnticipations.confirm({
    id: bulkId,
    recipientId,
  })
)

const destroyBulk = (client, {
  bulkId,
  recipientId,
}) => (
  client.bulkAnticipations.destroy({
    id: bulkId,
    recipientId,
  })
)

const getDefaultRecipient = client => (
  client.company.current()
    .then(path(['default_recipient_id', env]))
    .then(id => (
      Promise.all([
        client.recipients.find({ id }),
        client.recipient.balance(id),
      ])
        .then(([recipientData, balance]) => (
          { ...recipientData, balance }
        ))
    ))
)

const getRecipientById = (id, client) => (
  client.recipients.find({ id })
    .then(recipient => (
      Promise.all([
        Promise.resolve(recipient),
        client.recipient.balance(id),
      ])
        .then(([recipientData, balance]) => (
          { ...recipientData, balance }
        ))
    ))
)

const enhanced = compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter
)

const getErrorMessage = pipe(
  path(['response', 'errors']),
  head,
  prop('message')
)

const isPresetOrFuture = currenteDay => date =>
  currenteDay.isSameOrBefore(date)

const isValidDay = (calendar, client) => allPass([
  date => date && date.isValid(),
  isPresetOrFuture(moment()),
  partial(client.business.isBusinessDay, [calendar]),
])

const stepsId = {
  confirmation: 'confirmation',
  data: 'data',
  result: 'result',
}

const defaultStepsState = {
  currentStep: stepsId.data,
  statusMessage: '',
  stepsStatus: {
    [stepsId.data]: 'current',
    [stepsId.confirmation]: 'pending',
    [stepsId.result]: 'pending',
  },
}

const initialState = {
  ...defaultStepsState,
  approximateRequested: 0,
  bulkAnticipationStatus: null,
  bulkId: null,
  calendar: {},
  feesValues: {
    anticipation: 0,
    fraud: 0,
    otherFee: 0,
  },
  invalidDays: [],
  isAutomaticTransfer: true,
  limits: {
    maxValue: 0,
    minValue: 0,
  },
  loading: false,
  paymentDate: moment(),
  recalculationNeeded: false,
  requestedAmount: 0,
  statusMessage: '',
  timeframe: 'start',
}

const getStepsStatus = (nextStep, nextStepStatus) => {
  const buildStepsStatus = cond([
    [
      equals(stepsId.data),
      always({
        data: nextStepStatus,
        confirmation: 'pending',
        result: 'pending',
      }),
    ],
    [
      equals(stepsId.confirmation),
      always({
        data: 'success',
        confirmation: nextStepStatus,
        result: 'pending',
      }),
    ],
    [
      equals(stepsId.result),
      always({
        data: 'success',
        confirmation: 'success',
        result: nextStepStatus,
      }),
    ],
  ])

  return buildStepsStatus(nextStep)
}

class Anticipation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...initialState,
      bulkId: props.bulkId,
    }

    this.confirmBulk = this.confirmBulk.bind(this)
    this.createBulk = this.createBulk.bind(this)
    this.createOrUpdateBulk = this.createOrUpdateBulk.bind(this)
    this.destroyBulk = this.destroyBulk.bind(this)
    this.getAnticipationLimits = this.getAnticipationLimits.bind(this)
    this.getTransferCost = this.getTransferCost.bind(this)
    this.goTo = this.goTo.bind(this)
    this.goToBalance = this.goToBalance.bind(this)
    this.handleCalculateSubmit = this.handleCalculateSubmit.bind(this)
    this.handleConfirmationConfirm = this.handleConfirmationConfirm.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleLimitsChange = this.handleLimitsChange.bind(this)
    this.handleTimeframeChange = this.handleTimeframeChange.bind(this)
    this.updateBulk = this.updateBulk.bind(this)
  }

  componentDidMount () {
    const {
      client,
      history,
      match: {
        params: {
          id,
        },
      },
      onBulkDeleted,
    } = this.props

    const {
      bulkId,
      paymentDate,
    } = this.state

    let recipientPromise

    if (!id) {
      recipientPromise = getDefaultRecipient(client)
    } else {
      recipientPromise = getRecipientById(id, client)
    }

    client
      .business
      .requestBusinessCalendar(moment().get('year'))
      .then((calendar) => {
        const nextAnticipableDay = client
          .business
          .nextAnticipableBusinessDay(
            calendar,
            { hour: 10, minute: 20 },
            paymentDate
          )

        this.setState({
          paymentDate: nextAnticipableDay,
          calendar,
        })

        return calendar
      })
      .catch(error => this.setState({ businessCalendarError: error }))

    recipientPromise
      .then((recipient) => {
        this.setState(
          {
            loading: true,
            recipient,
          },
          () => {
            this.setState({
              transferCost: this.getTransferCost(),
            })

            if (bulkId) {
              return this.destroyBulk()
                .then(() => {
                  this.setState(
                    {
                      bulkId: null,
                    },
                    () => {
                      onBulkDeleted()
                      this.getAnticipationLimits()
                        .then(this.createBulk)
                    })
                })
            }

            return this.getAnticipationLimits()
              .then(this.createBulk)
          }
        )

        if (!id) {
          history.replace(`/anticipation/${recipient.id}`)
        }
      })
  }

  componentWillUnmount () {
    const {
      bulkAnticipationStatus,
      bulkId,
    } = this.state

    const {
      client,
      match: {
        params: {
          id: recipientId,
        },
      },
    } = this.props

    if (bulkAnticipationStatus !== 'pending') {
      this.destroyBulk(client, {
        bulkId,
        recipientId,
      })
    }
  }

  getAnticipationLimits () {
    const {
      recipient: {
        id: recipientId,
      },
      paymentDate,
      timeframe,
    } = this.state

    const { client } = this.props

    return getAnticipationLimits(client, {
      recipientId,
      timeframe,
      payment_date: paymentDate,
    })
      .then((response) => {
        const maxValue = calculateMaxLimit(response)
        this.setState({
          error: null,
          limits: {
            ...response,
            maxValue,
            minValue: calculateMinLimit(response),
          },
          requestedAmount: maxValue,
          recalculationNeeded: true,
          loading: false,
        })
      })
      .catch(pipe(getErrorMessage, error => this.setState({
        error,
        loading: false,
      })))
  }

  getTransferCost () {
    const {
      recipient,
    } = this.state
    const bankCode = path(['bank_account', 'bank_code'], recipient)

    if (recipient && bankCode) {
      // eslint-disable-next-line camelcase
      const { pricing: { transfers: { ted, credito_em_conta } } } = this.props

      if (contains(partnersBankCodes, bankCode)) {
        return credito_em_conta // eslint-disable-line camelcase
      }

      return -ted
    }

    return 0
  }

  handleLimitsChange () {
    const {
      limits: {
        minValue,
      },
    } = this.state

    this.createOrUpdateBulk(minValue)
      .then(this.getAnticipationLimits)
  }

  handleTimeframeChange (timeframe) {
    this.setState(
      {
        timeframe,
        loading: true,
      },
      this.handleLimitsChange
    )
  }

  handleDateChange ({ start }) {
    this.setState(
      {
        paymentDate: start,
        loading: true,
      },
      this.handleLimitsChange
    )
  }

  handleCalculateSubmit ({
    date,
    isAutomaticTransfer,
    requested,
    timeframe,
  }) {
    this.setState(
      {
        error: null,
        isAutomaticTransfer,
        paymentDate: date,
        recalculationNeeded: false,
        requestedAmount: requested,
        timeframe,
      },
      this.createOrUpdateBulk
    )
  }

  createOrUpdateBulk (minValue) {
    const {
      bulkId,
    } = this.state

    if (!bulkId) {
      return this.createBulk(minValue)
    }

    return this.updateBulk(minValue)
  }

  handleConfirmationConfirm (password) {
    const {
      client,
      t,
    } = this.props

    const { session_id: sessionId } = client.authentication

    this.setState({
      loading: true,
    })

    client.session.verify({
      id: sessionId,
      password,
    })
      .then(({ valid }) => {
        if (valid) {
          this.setState({
            error: '',
          })

          this.confirmBulk()
        } else {
          this.setState({
            loading: false,
            error: t('pages.anticipation.wrong_pass'),
          })
        }
      })
  }

  handleFormChange () {
    this.setState({
      recalculationNeeded: true,
    })
  }

  goTo (nextStep, nextStepStatus) {
    this.setState({
      currentStep: nextStep,
      stepsStatus: getStepsStatus(nextStep, nextStepStatus),
    })
  }

  goToBalance () {
    const {
      recipient: {
        id,
      },
    } = this.state

    const {
      history,
    } = this.props
    history.push(`/balance/${id}`)
  }

  destroyBulk () {
    const {
      bulkId,
      recipient: {
        id: recipientId,
      },
    } = this.state

    const {
      client,
    } = this.props
    return destroyBulk(client, {
      bulkId,
      recipientId,
    })
      .catch((error) => { console.warn(error) }) //eslint-disable-line
  }

  updateBulk (value) {
    const {
      bulkId,
      isAutomaticTransfer,
      paymentDate,
      recipient: {
        id: recipientId,
      },
      requestedAmount,
      timeframe,
    } = this.state

    const {
      client,
      onBulkUpdated,
    } = this.props

    return updateBulk(client, {
      automaticTransfer: isAutomaticTransfer,
      bulkId,
      paymentDate,
      recipientId,
      requestedAmount: value || requestedAmount,
      timeframe,
    })
      .then(({
        amount,
        anticipation_fee: anticipationFee,
        fee,
        fraud_coverage_fee: fraudCovarageFee,
        status,
      }) => {
        this.setState({
          approximateRequested: amount - fee,
          bulkAnticipationStatus: status,
          feesValues: {
            anticipation: anticipationFee,
            fraud: fraudCovarageFee,
            otherFee: fee,
          },
          loading: false,
          requestedAmount: value || requestedAmount,
        })
        onBulkUpdated({ bulkId })
      })
      .catch(pipe(getErrorMessage, error => this.setState({
        error,
        loading: false,
      })))
  }

  confirmBulk () {
    const {
      bulkId,
      recipient: {
        id: recipientId,
      },
    } = this.state

    const {
      client,
      onBulkConfirmed,
      t,
    } = this.props

    confirmBulk(client, {
      bulkId,
      recipientId,
    })
      .then(({ status }) => {
        this.setState({
          bulkAnticipationStatus: status,
          loading: false,
          currentStep: 'result',
          statusMessage: t('pages.anticipation.anticipation_success'),
          stepsStatus: getStepsStatus('result', 'success'),
        })
        onBulkConfirmed()
      })
      .catch(pipe(getErrorMessage, error => this.setState({
        currentStep: 'result',
        loading: false,
        statusMessage: error,
        stepsStatus: getStepsStatus('result', 'error'),
      })))
  }

  createBulk (value) {
    const {
      isAutomaticTransfer,
      paymentDate,
      recipient: {
        id: recipientId,
      },
      requestedAmount,
      timeframe,
    } = this.state

    const {
      client,
      onBulkCreated,
    } = this.props

    return createBulk(client, {
      automaticTransfer: isAutomaticTransfer,
      paymentDate,
      recipientId,
      requestedAmount: value || requestedAmount,
      timeframe,
    })
      .then(({
        amount,
        anticipation_fee: anticipationFee,
        fee,
        fraud_coverage_fee: fraudCovarageFee,
        id,
        status,
      }) => {
        this.setState({
          approximateRequested: amount - fee,
          bulkAnticipationStatus: status,
          bulkId: id,
          error: null,
          feesValues: {
            anticipation: anticipationFee,
            fraud: fraudCovarageFee,
            otherFee: fee,
          },
          loading: false,
          requestedAmount: value || requestedAmount,
        })
        onBulkCreated({ bulkId: id })
      })
      .catch(pipe(getErrorMessage, error => this.setState({
        error,
      })))
  }

  render () {
    const {
      approximateRequested,
      businessCalendarError,
      calendar,
      currentStep,
      error,
      feesValues: {
        anticipation,
        fraud,
      },
      isAutomaticTransfer,
      limits: {
        maxValue,
        minValue,
      },
      loading,
      paymentDate,
      recalculationNeeded,
      recipient,
      requestedAmount,
      statusMessage,
      stepsStatus,
      timeframe,
      transferCost,
    } = this.state

    const {
      client,
      t,
    } = this.props

    const totalCost = -(anticipation + fraud)
    const amount = approximateRequested + totalCost + transferCost

    if (businessCalendarError) {
      return (
        <Alert
          icon={<IconInfo height={16} width={16} />}
          type="info"
        >
          <span>
            {pathOr(
              t('pages.balance.unknown_error'),
              ['errors', 0, 'message'],
              error
            )}
          </span>
        </Alert>
      )
    }

    return (
      <Fragment>
        {!isNil(recipient) &&
          <AnticipationContainer
            amount={amount}
            approximateRequested={approximateRequested}
            automaticTransfer={isAutomaticTransfer}
            currentStep={currentStep}
            date={paymentDate}
            error={error}
            loading={loading}
            maximum={maxValue}
            minimum={minValue}
            onCalculateSubmit={this.handleCalculateSubmit}
            onCancel={this.goToBalance}
            onConfirmationConfirm={this.handleConfirmationConfirm}
            onConfirmationReturn={() => this.goTo('data', 'current')}
            onDataConfirm={() => this.goTo('confirmation', 'current')}
            onDateChange={this.handleDateChange}
            onFormChange={this.handleFormChange}
            onTimeframeChange={this.handleTimeframeChange}
            onTryAgain={() => this.goTo('data', 'current')}
            onViewStatement={this.goToBalance}
            recalculationNeeded={recalculationNeeded}
            recipient={recipient}
            requested={requestedAmount}
            statusMessage={statusMessage}
            stepsStatus={stepsStatus}
            t={t}
            timeframe={timeframe}
            totalCost={totalCost}
            transferCost={isAutomaticTransfer && transferCost ? transferCost : 0}
            validateDay={isValidDay(calendar, client)}
          />
        }
      </Fragment>
    )
  }
}

Anticipation.propTypes = {
  bulkId: PropTypes.string,
  client: PropTypes.shape({
    bulkAnticipations: PropTypes.shape({
      limits: PropTypes.func,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func,
    replace: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onBulkConfirmed: PropTypes.func.isRequired,
  onBulkCreated: PropTypes.func.isRequired,
  onBulkDeleted: PropTypes.func.isRequired,
  onBulkUpdated: PropTypes.func.isRequired,
  pricing: PropTypes.shape({
    transfers: PropTypes.shape({
      credito_em_conta: PropTypes.number,
      ted: PropTypes.number,
    }),
  }).isRequired,
  t: PropTypes.func.isRequired,
}

Anticipation.defaultProps = {
  bulkId: null,
}

export default enhanced(Anticipation)
