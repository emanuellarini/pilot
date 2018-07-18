import React from 'react'
import legalQuantity from '../../../src/models/recipientLegalPartnersQuantity'
import RecipientStep from '../../../src/containers/RecipientStep'


const RecipientStepContainer = () => (
  <RecipientStep
    numbers={legalQuantity.numbers}
    t={translate => translate}
  />
)

export default RecipientStepContainer
