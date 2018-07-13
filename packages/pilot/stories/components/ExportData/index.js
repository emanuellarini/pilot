import React from 'react'
import { action } from '@storybook/addon-actions'

import Section from '../../Section'
import ExportData from '../../../src/components/ExportData'

const ExportDataExample = () => (
  <Section>
    <ExportData
      onClick={action('data')}
      title="Exportar"
    />
  </Section>
)

export default ExportDataExample

