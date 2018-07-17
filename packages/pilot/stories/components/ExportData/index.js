import React from 'react'
import { action } from '@storybook/addon-actions'

import Section from '../../Section'
import ExportData from '../../../src/components/ExportData'
import DownloadIcon from 'emblematic-icons/svg/Download32.svg'

const ExportDataExample = () => (
  <Section>
    <ExportData
      icon={<DownloadIcon width={16} height={16} />}
      exportOptions={[
        { title: 'CSV', mime: '.csv' },
        { title: 'Excel', mime: '.xlsx' }
      ]}
      onExport={(mimeType) => undefined}
      subTitle="Export to"
      titlte="Export"
    />
  </Section>
)

export default ExportDataExample

