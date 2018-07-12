import React, { Fragment } from 'react'
import {
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverMenu,
} from 'former-kit'
import { action } from '@storybook/addon-actions'

import DownloadIcon from 'emblematic-icons/svg/Download32.svg'
import TrashIcon from 'emblematic-icons/svg/Trash32.svg'
import ReprocessIcon from 'emblematic-icons/svg/Reprocess32.svg'
import ReportCard from '../../../src/components/ReportCard'
import style from './style.css'

const items = [
  {
    title: 'PDF',
    action: action('pdf'),
  },
  {
    title: 'Excel',
    action: action('excel'),
  },
  {
    title: 'csv',
    action: action('csv'),
  },
]

const reportData = {
  id: 'rep_fjh9eevpv00031uo7st5nscqc',
  status: 'ready',
  type: 'plans',
  data: {
    company_id: '58ebcf091173c91400a0b05d',
    created_at: '2018-03-11T00:00:00.000Z',
    updated_at: '2018-03-11T00:00:00.000Z',
  },
  url: 'http://s3.amazonaws.com/tract-live/public/plans_cjh9eew06000012rxte25jpkr.json?AWSAccessKeyId=AKIAIUD2DGLYBPF7X3FA&Expires=1526493233&Signature=ce4THQeQV%2Ft%2BDPUnbTHSYo51mCI%3D',
  created_at: '2018-05-16T17:47:02.035Z',
  updated_at: '2018-05-16T17:47:02.596Z',
}

const renderActions = (report) => {
  if (report.status === 'canceled') {
    return (
      <Fragment>
        <Button
          fill="outline"
          icon={<TrashIcon width={16} height={16} />}
          key="Item 1"
          onClick={action('delete')}
          size="default"
        />

        <Button
          fill="outline"
          icon={<ReprocessIcon width={16} height={16} />}
          key="Item 1"
          onClick={action('reprocess')}
          size="default"
        />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Button
        fill="outline"
        icon={<TrashIcon width={16} height={16} />}
        key="Item 1"
        onClick={action('delete')}
        size="default"
      />
      <Popover
        content={
          <div className={style.exportPopover}>
            <PopoverContent>
              <strong>Exportar para:</strong>
            </PopoverContent>
            <PopoverMenu items={items} />
          </div>
        }
        placement="bottomEnd"
      >
        <Button
          fill="outline"
          icon={<DownloadIcon width={16} height={16} />}
          onClick={action('download')}
          size="default"
        />
      </Popover>
    </Fragment>
  )
}

class ReportCardState extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      ...reportData,
    }
  }

  render () {
    return (
      <Card>
        <ReportCard
          actions={renderActions(reportData)}
          filterLabel="Filtros"
          subtitle="Período: 01/01/2017 a 01/06/2017   |   Criado em 10/05/2018"
          status={reportData.status}
          statusLabel="Status"
          title="Carta de circularização 2017"
        />
      </Card>
    )
  }
}

export default ReportCardState
