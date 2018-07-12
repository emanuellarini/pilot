import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  CardContent,
  CardSection,
  CardSectionDoubleLineTitle,
  Legend,
} from 'former-kit'
import reportStatusLegend from '../../models/reportStatusLegend'
import style from './style.css'


class ReportCard extends Component {
  constructor () {
    super()
    this.state = {
      collapsed: true,
    }
  }

  render () {
    const {
      actions,
      filterLabel,
      subtitle,
      status,
      statusLabel,
      title,
    } = this.props
    return (
      <CardContent>
        <CardSection>
          <CardSectionDoubleLineTitle
            actions={actions}
            collapsed={this.state.collapsed}
            icon={
              <Legend
                color={reportStatusLegend[status].color}
                acronym={reportStatusLegend[status].acronym}
                hideLabel
              />
            }
            onClick={
              () => this.setState({ collapsed: !this.state.collapsed })
            }
            subtitle={subtitle}
            title={title}
          />
          {!this.state.collapsed &&
            <CardContent className={style.reportDetails}>
              <span>{filterLabel}</span>
              <span>{statusLabel}: {reportStatusLegend[status].text}</span>
            </CardContent>
          }
        </CardSection>
      </CardContent>
    )
  }
}

ReportCard.propTypes = {
  actions: PropTypes.func.isRequired,
  filterLabel: PropTypes.string.isRequired,
  subtitle: PropTypes.node.isRequired,
  status: PropTypes.string.isRequired,
  statusLabel: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
}

export default ReportCard

