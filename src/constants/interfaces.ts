export type Page = 'theory' | 'quiz'

export type Language = 'ua' | 'en' | 'ru'

export const languagesList: Language[] = ['ua', 'en', 'ru']

export const languagesObjString: Record<Language, string> = {
  en: '',
  ua: '',
  ru: '',
}

export const languagesObjArray: Record<Language, []> = {
  en: [],
  ua: [],
  ru: [],
}

export interface Course {
  id: number
  name: Record<Language, string>
  description: Record<Language, string>
  modules: []
}

export interface Chapter {
  id: number
  courseID: number // parent
  name: Record<Language, string>
  lessons?: LessonWithLanguages[]
  finalTest?: Quiz[]
}

export interface LessonWithLanguages {
  id?: string
  moduleId: string | number // parent chapter
  number: number
  name: Record<Language, string>
  comment: Record<Language, string>
  text: Record<Language, string>
  banner: string
  avatar: string
  motivation: Record<Language, string>
  quiz: Quiz[]
}

export interface Quiz {
  index?: number
  question: Record<Language, string>
  options: Record<Language, any[]>
  correctAnswer: Record<Language, any[]>
}

export type FinalTest = Quiz[]
