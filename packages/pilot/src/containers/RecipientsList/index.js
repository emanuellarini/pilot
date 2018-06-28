import React from 'react'
import PropTypes from 'prop-types'

import IconInfo from 'emblematic-icons/svg/Info32.svg'
import Search32 from 'emblematic-icons/svg/Search32.svg'

import {
  findIndex,
  propEq,
} from 'ramda'

import {
  Alert,
  Card,
  CardActions,
  CardContent,
  Col,
  Grid,
  Input,
  Pagination,
  Row,
  Table,
} from 'former-kit'

import Filter from '../Filter'
import tableColumns from './tableColumns'

const RecipientsList = ({
  expandedRows,
  filterOptions,
  loading,
  onDetailsClick,
  onExpandRow,
  onFilterChange,
  onFilterClear,
  onOrderChange,
  onPageChange,
  onRowClick,
  onSelectRow,
  order,
  orderField,
  pagination,
  query,
  rows,
  selectedRows,
  t,
}) => {
  const columns = tableColumns({ t, onDetailsClick })
  const orderColumn = findIndex(propEq('accessor', orderField), columns)
  const handleOrderChange = columnIndex =>
    onOrderChange(columns[columnIndex].accessor)
  return (
    <Grid>
      <Row>
        <Col
          palm={12}
          tablet={12}
          desk={12}
          tv={12}
        >
          <Filter
            disabled={loading}
            onChange={onFilterChange}
            onClear={onFilterClear}
            options={filterOptions}
            query={query}
            t={t}
          >
            <Input
              icon={<Search32 width={16} height={16} />}
              name="search"
              placeholder={t('pages.recipients.text_search_placeholder')}
            />
          </Filter>
        </Col>
        <Col
          palm={12}
          tablet={12}
          desk={12}
          tv={12}
        >
          {rows.length <= 0 && !loading &&
            <Alert
              icon={<IconInfo height={16} width={16} />}
              type="info"
            >
              <p>
                <strong>{t('pages.recipients.no_results')}</strong>&nbsp;
                {t('pages.recipients.try_again')}
              </p>
            </Alert>
          }
          {rows.length > 0 &&
            <Card>
              <CardActions>
                <Pagination
                  currentPage={pagination.offset}
                  totalPages={pagination.total}
                  onPageChange={onPageChange}
                  disabled={loading}
                  strings={{
                    of: t('components.pagination.of'),
                  }}
                />
              </CardActions>

              <CardContent>
                <Table
                  columns={columns}
                  disabled={loading}
                  expandable
                  expandedRows={expandedRows}
                  maxColumns={6}
                  onExpandRow={onExpandRow}
                  onOrderChange={handleOrderChange}
                  onRowClick={onRowClick}
                  onSelectRow={onSelectRow}
                  orderColumn={orderColumn}
                  orderSequence={order}
                  rows={rows}
                  selectedRows={selectedRows}
                />
              </CardContent>
            </Card>
          }
        </Col>
      </Row>
    </Grid>
  )
}

RecipientsList.propTypes = {
  // eslint-disable-next-line
  query: PropTypes.shape({
    search: PropTypes.string,
  }),
  expandedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  onExpandRow: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterClear: PropTypes.func.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  order: PropTypes.string,
  orderField: PropTypes.arrayOf(PropTypes.string),
  pagination: PropTypes.shape({
    offset: PropTypes.number,
    total: PropTypes.number,
  }).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  t: PropTypes.func.isRequired,
}

RecipientsList.defaultProps = {
  order: 'descending',
  orderField: [],
  query: {
    search: '',
  },
}

export default RecipientsList
