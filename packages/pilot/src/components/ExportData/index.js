import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverMenu,
} from 'former-kit'
import DownloadIcon from 'emblematic-icons/svg/Download32.svg'
import style from './style.css'

const items = [
  {
    title: 'PDF',
    action: () => null,
  },
  {
    title: 'Excel',
    action: () => null,
  },
  {
    title: 'csv',
    action: () => null,
  },
]

const ExportData = ({
  onClick,
  title,
}) => (
  <Popover
    content={
      <div className={style.exportPopover}>
        <PopoverContent>
          <strong>Exportar para:</strong>
        </PopoverContent>
        <PopoverMenu items={items} />
      </div>
    }
    placement="bottomStart"
  >
    <Button
      fill="outline"
      icon={<DownloadIcon width={16} height={16} />}
      size="tiny"
      relevance="low"
      onClick={onClick}
    >
      {title}
    </Button>
  </Popover>
)

ExportData.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default ExportData

