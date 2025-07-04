import React from 'react'
import globalStyles from '../../constants/globalStyles'
import { Language, Quiz } from '../../constants/interfaces'

function FinalTestItem({ quiz, language }: { quiz: Quiz; language: Language }) {
  return (
    <div style={globalStyles.item}>
      <p style={globalStyles.titleFlex}>{quiz.question[language]}</p>
    </div>
  )
}

export default React.memo(FinalTestItem)
