import React from 'react'
import {
  pipe,
  prop,
} from 'ramda'

import {
  Button,
  Col,
  Grid,
  Row,
} from 'former-kit'

import formatDate from '../../formatters/longDate'
import renderStatusLegend from '../../containers/RecipientsList/statusLegend'

const columnData = data => (
  data.map(item => (
    <Row>
      <span>
        {item.title}
      </span>
      <strong>
        {item.content}
      </strong>
    </Row>
  ))
)

const getDefaultColumns = ({ t }) => ([
  {
    title: t('components.models.recipient.status'),
    renderer: renderStatusLegend,
    accessor: ['status'],
    orderable: true,
  },
  {
    title: t('components.models.recipient.id'),
    accessor: ['id'],
    orderable: true,
  },
  {
    title: t('components.models.recipient.bank_account_id'),
    accessor: ['bank_account', 'id'],
    orderable: true,
  },
  {
    title: t('components.models.recipient.bank_account_legal_name'),
    accessor: ['bank_account', 'legal_name'],
    orderable: true,
  },
  {
    title: t('components.models.recipient.bank_account_document_number'),
    accessor: ['bank_account', 'document_number'],
    orderable: true,
  },
  {
    title: t('components.models.recipient.date_created'),
    accessor: ['created_at'],
    orderable: true,
    renderer: pipe(prop('created_at'), formatDate),
  },
  {
    title: '',
    accessor: ['created_at'],
    isAction: false,
    renderer: data => (
      <Row stretch>
        <Col
          desk={6}
          palm={6}
          tablet={6}
          tv={6}
        >
          <Grid>
            {columnData([
              {
                title: t('components.models.recipient.automatic_anticipation_enabled'),
                content: t(`components.models.recipient.automatic_anticipation_enabled_boolean.${data.automatic_anticipation_enabled}`),
              }, {
                title: t('components.models.recipient.automatic_anticipation_1025_delay'),
                content: JSON.stringify(data.automatic_anticipation_1025_delay),
              }, {
                title: t('components.models.recipient.automatic_anticipation_days'),
                content: data.automatic_anticipation_days,
              },
              {
                title: t('components.models.recipient.automatic_anticipation_type'),
                content: t(`components.models.recipient.automatic_anticipation_type_of.${data.automatic_anticipation_type}`),
              }, {
                title: t('components.models.recipient.anticipatable_volume_percentage'),
                content: `${data.anticipatable_volume_percentage}%`,
              }, {
                title: '',
                content: '',
              },
             ])}
          </Grid>
        </Col>
        <Col
          desk={6}
          palm={6}
          tablet={6}
          tv={6}
        >
          <Grid>
            {columnData([
              {
                title: t('components.models.recipient.transfer_enabled'),
                content: t(`components.models.recipient.transfer_enabled_boolean.${data.transfer_enabled}`),
              }, {
                title: t('components.models.recipient.transfer_interval'),
                content: t(`components.models.recipient.transfer_interval_of.${data.transfer_interval}`),
              }, {
                title: t('components.models.recipient.transfer_day'),
                content: data.transfer_day,
              }, {
                title: t('components.models.recipient.date_updated'),
                content: formatDate(data.date_updated),
              }, {
                title: '',
                content: '',
              }, {
                title: '',
                content: '',
              },
            ])}
          </Grid>
        </Col>
      </Row>
    ),
  },
  {
    aggregationRenderer: null,
    aggregationTitle: null,
    aggregator: null,
    align: 'center',
    isAction: true,
    orderable: false,
    renderer: index => (
      <Button
        fill="outline"
        onClick={() => (index)}
      >
        {t('components.models.recipient.show_details')}
      </Button>
    ),
    title: t('components.models.recipient.details'),
  },
])

export default getDefaultColumns
