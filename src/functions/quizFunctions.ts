import {
  Language,
  languagesList,
  languagesObjArray,
  languagesObjString,
  Quiz,
} from '../constants/interfaces'

export const handleCreateQuiz = (quizArray: Quiz[]) => {
  return {
    index: quizArray.length,
    question: languagesObjString,
    options: languagesObjArray,
    correctAnswer: languagesObjArray,
  }
}

export const addOption = (quiz: Quiz) => {
  if (quiz === null) return null

  return {
    ...quiz,
    options: {
      en: [...quiz.options.en, ''],
      ua: [...quiz.options.ua, ''],
      ru: [...quiz.options.ru, ''],
    },
  }
}

export const addCorrectAnswer = (index: number, quiz: Quiz) => {
  if (quiz === null) return null
  const optionEn = quiz.options.en[index]
  const optionUa = quiz.options.ua[index]
  const optionRu = quiz.options.ru[index]

  return {
    ...quiz,
    correctAnswer: {
      en: quiz.correctAnswer.en.includes(optionEn)
        ? quiz.correctAnswer.en
        : [...quiz.correctAnswer.en, optionEn],
      ua: quiz.correctAnswer.ua.includes(optionUa)
        ? quiz.correctAnswer.ua
        : [...quiz.correctAnswer.ua, optionUa],
      ru: quiz.correctAnswer.ru.includes(optionRu)
        ? quiz.correctAnswer.ru
        : [...quiz.correctAnswer.ru, optionRu],
    },
  }
}

export const removeCorrectAnswer = (index: number, quiz: Quiz) => {
  if (quiz === null) return null
  const optionEn = quiz.options.en[index]
  const optionUa = quiz.options.ua[index]
  const optionRu = quiz.options.ru[index]

  return {
    ...quiz,
    correctAnswer: {
      en: quiz.correctAnswer.en.filter((val) => val !== optionEn),
      ua: quiz.correctAnswer.ua.filter((val) => val !== optionUa),
      ru: quiz.correctAnswer.ru.filter((val) => val !== optionRu),
    },
  }
}

export const removeOption = (index: number, quiz: Quiz) => {
  if (quiz === null) return null

  return {
    ...quiz!,
    options: {
      en: quiz.options.en.filter((_, i) => i !== index),
      ua: quiz.options.ua.filter((_, i) => i !== index),
      ru: quiz.options.ru.filter((_, i) => i !== index),
    },
    correctAnswer: {
      en: quiz.correctAnswer.en.filter((val) => val !== quiz.options.en[index]),
      ua: quiz.correctAnswer.ua.filter((val) => val !== quiz.options.ua[index]),
      ru: quiz.correctAnswer.ru.filter((val) => val !== quiz.options.ru[index]),
    },
  }
}

export const updateOption = (
  index: number,
  newValue: string,
  quiz: Quiz,
  localLanguage: Language
) => {
  if (quiz === null) return null

  const oldValue = quiz.options[localLanguage][index]
  const updatedOptions = [...quiz.options[localLanguage]]
  updatedOptions[index] = newValue

  const updatedCorrectAnswers = quiz.correctAnswer[localLanguage].map(
    (answer) => (answer === oldValue ? newValue : answer)
  )

  return {
    ...quiz,
    options: {
      ...quiz.options,
      [localLanguage]: updatedOptions,
    },
    correctAnswer: {
      ...quiz.correctAnswer,
      [localLanguage]: updatedCorrectAnswers,
    },
  }
}

export const isQuizValid = (quiz: Quiz): boolean => {
  for (const lang of languagesList) {
    const question = quiz.question[lang]
    const options = quiz.options[lang]
    const correctAnswers = quiz.correctAnswer[lang]

    // Check question is not empty
    if (!question || question.trim() === '') return false

    // Check options are non-empty and unique
    if (
      options.length === 0 ||
      options.some((opt) => !opt || opt.trim() === '') ||
      new Set(options).size !== options.length
    ) {
      return false
    }

    // Check at least one correct answer
    if (correctAnswers.length === 0) return false
  }

  return true
}
