import React from 'react'
import { Legend } from 'former-kit'

import style from './style.css'
import status from '../../models/recipientStatusLegends'

const renderStatusLegend = item => (
  <div className={style.centralizedItem}>
    <Legend
      color={status[item.status].color}
      acronym={status[item.status].acronym}
      hideLabel
    >
      {status[item.status].text}
    </Legend>
  </div>
)

export default renderStatusLegend
