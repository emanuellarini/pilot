import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  CardContent,
  CardSection,
  CardSectionDoubleLineTitle,
  Legend,
} from 'former-kit'
import moment from 'moment'
import reportStatusLegend from '../../models/reportStatusLegend'
import style from './styles.css'

class ReportCard extends Component {
  constructor () {
    super()
    this.state = {
      collapsed: false,
    }
  }

  render () {
    const {
      actions,
      report,
      subtitle,
      title,
    } = this.props
    return (
      <CardSection>
        <CardSectionDoubleLineTitle
          actions={actions}
          collapsed={!this.state.collapsed}
          icon={
            <Legend
              color={reportStatusLegend[report.status].color}
              acronym={reportStatusLegend[report.status].acronym}
              hideLabel
            />
          }
          onClick={
            () => this.setState({ collapsed: !this.state.collapsed })
          }
          subtitle={subtitle}
          title={title}
        />
        {this.state.collapsed &&
          <CardContent className={style.reportDetails}>
            <span>Filtros</span>
            <span>Status: {reportStatusLegend[report.status].text}</span>
          </CardContent>
        }
      </CardSection>
    )
  }
}

ReportCard.propTypes = {
  actions: PropTypes.func.isRequired,
  report: PropTypes.shape({
    created_at: PropTypes.instanceOf(moment),
    data: PropTypes.shape({
      company_id: PropTypes.string,
      created_at: PropTypes.instanceOf(moment),
      updated_at: PropTypes.instanceOf(moment),
    }).isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
    updated_at: PropTypes.instanceOf(moment),
    url: PropTypes.string,
  }).isRequired,
  subtitle: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
}

export default ReportCard

