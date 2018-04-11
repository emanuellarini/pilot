import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {
  compose,
  map,
  pathOr,
  head,
  pipe,
} from 'ramda'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import cockpit from 'cockpit'

import UserSettings from '../../containers/Settings/User'

const mapStateToProps = ({
  account: { client, user },
}) => ({ client, user })


const enhanced = compose(
  withRouter,
  connect(mapStateToProps),
  translate()
)

class UserSettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      passwordFormStatus: {
        error: null,
        success: false,
      },
    }
    this.client = cockpit(props.client)
    this.handleRedefinePassword = this.handleRedefinePassword.bind(this)
  }

  handleRedefinePassword ({ current_password, new_password }) {
    const { id } = this.props.user
    this.client
      .user.updatePassword({
        current_password,
        new_password,
        id,
      })
      .then(() => this.setState({
        passwordFormStatus: {
          success: true,
          error: null,
        },
      }))
      .catch((response) => {
        const formatErrors = pipe(
          pathOr([], ['response', 'errors']),
          map(error => error.message),
          head
        )

        this.setState({
          passwordFormStatus: {
            success: false,
            error: formatErrors(response),
          },
        })
      })
  }

  render () {
    const {
      t,
    } = this.props

    return (
      <UserSettings
        passwordFormStatus={this.state.passwordFormStatus}
        handlePasswordFormSubmit={this.handleRedefinePassword}
        t={t}
      />
    )
  }
}

UserSettingsPage.propTypes = {
  client: PropTypes.object.isRequired, // eslint-disable-line
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

export default enhanced(UserSettingsPage)
