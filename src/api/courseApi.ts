// api/courseApi.ts
import { Course, Chapter, Language, LessonWithLanguages, Quiz } from '../constants/interfaces'

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://192.168.1.14:3004'

const headers = {
  'Content-Type': 'application/json',
}

// COURSES API Functions

/**
 * Получить все курсы
 * GET /courses
 */
export async function GetCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

/**
 * Получить курс по ID
 * GET /courses/{id}
 */
export async function GetCourseById(id: string): Promise<Course> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching course:', error)
    throw error
  }
}

/**
 * Создать новый курс
 * POST /courses
 */
export async function CreateCourse(
  name: Record<Language, string>,
  description: Record<Language, string>,
  token: string
): Promise<Course> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: { 
        ...headers, 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create course')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating course:', error)
    throw error
  }
}

/**
 * Обновить курс
 * PUT /courses/{id}
 */
export async function UpdateCourse(
  id: string,
  name: Record<Language, string>,
  description: Record<Language, string>,
  token: string
): Promise<Course> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: { 
        ...headers, 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update course')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating course:', error)
    throw error
  }
}

/**
 * Удалить курс
 * DELETE /courses/{id}
 */
export async function DeleteCourse(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete course')
    }
  } catch (error) {
    console.error('Error deleting course:', error)
    throw error
  }
}

// MODULES/CHAPTERS API Functions

/**
 * Получить все модули/главы курса
 * GET /modules/course/{courseId}
 */
export async function GetCourseModules(courseId: string): Promise<Chapter[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/course/${courseId}`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching course modules:', error)
    throw error
  }
}

/**
 * Создать новый модуль/главу
 * POST /modules
 */
export async function CreateChapter(
  name: Record<Language, string>,
  courseId: number,
  token: string
): Promise<Chapter> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        courseId: courseId,
        finalTest: [],
      }),
      headers: { 
        ...headers, 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create chapter')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating chapter:', error)
    throw error
  }
}

/**
 * Получить модуль по ID
 * GET /modules/{id}
 */
export async function GetChapterById(id: string): Promise<Chapter> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching chapter:', error)
    throw error
  }
}

/**
 * Обновить модуль/главу
 * PUT /modules/{id}
 */
export async function UpdateChapter(
  id: string,
  name: Record<Language, string>,
  token: string
): Promise<Chapter> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: name,
      }),
      headers: { 
        ...headers, 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update chapter')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating chapter:', error)
    throw error
  }
}

/**
 * Удалить модуль/главу
 * DELETE /modules/{id}
 */
export async function DeleteChapter(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete chapter')
    }
  } catch (error) {
    console.error('Error deleting chapter:', error)
    throw error
  }
}

// LESSONS API Functions

/**
 * Получить все уроки в модуле/главе
 * GET /modules/{moduleId}/lessons
 */
export async function GetModuleLessons(moduleId: string): Promise<LessonWithLanguages[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/lessons`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching module lessons:', error)
    throw error
  }
}

/**
 * Получить урок по ID
 * GET /lessons/{id}
 */
export async function GetLessonById(id: string): Promise<LessonWithLanguages> {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching lesson:', error)
    throw error
  }
}

/**
 * Создать новый урок
 * POST /lessons
 */
export async function CreateLesson(lesson: FormData, token: string): Promise<LessonWithLanguages> {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons`, {
      method: 'POST',
      body: lesson,
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create lesson')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating lesson:', error)
    throw error
  }
}

/**
 * Обновить урок
 * PUT /lessons/{id}
 */
export async function UpdateLesson(
  id: string,
  lesson: FormData,
  token: string
): Promise<LessonWithLanguages> {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: 'PUT',
      body: lesson,
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update lesson')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating lesson:', error)
    throw error
  }
}

/**
 * Удалить урок
 * DELETE /lessons/{id}
 */
export async function DeleteLesson(id: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      method: 'DELETE',
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to delete lesson')
    }
  } catch (error) {
    console.error('Error deleting lesson:', error)
    throw error
  }
}

// COURSE STATISTICS

/**
 * Получить статистику курса
 * Эта функция агрегирует данные из разных эндпоинтов
 */
export async function GetCourseStatistics(courseId: string): Promise<{
  totalChapters: number
  totalLessons: number
  totalQuizzes: number
  completedChapters: number
  estimatedDuration: number
  lastUpdated: string
}> {
  try {
    const course = await GetCourseById(courseId)
    
    const totalChapters = course.modules?.length || 0
    const totalLessons = course.modules?.reduce((acc: number, chapter: Chapter) => 
      acc + (chapter.lessons?.length || 0), 0) || 0
    
    const totalQuizzes = course.modules?.reduce((acc: number, chapter: Chapter) => {
      const lessonQuizzes = chapter.lessons?.reduce((lessonAcc: number, lesson: LessonWithLanguages) => 
        lessonAcc + (lesson.quiz?.length || 0), 0) || 0
      const finalTestCount = chapter.finalTest?.length || 0
      return acc + lessonQuizzes + finalTestCount
    }, 0) || 0
    
    const completedChapters = course.modules?.filter((chapter: Chapter) => 
      chapter.lessons && chapter.lessons.length > 0).length || 0
    
    const estimatedDuration = totalLessons * 15 // примерно 15 минут на урок
    
    return {
      totalChapters,
      totalLessons,
      totalQuizzes,
      completedChapters,
      estimatedDuration,
      lastUpdated: new Date().toISOString() // Используем текущее время
    }
  } catch (error) {
    console.error('Error fetching course statistics:', error)
    throw error
  }
}

// FINAL TEST API Functions

/**
 * Получить финальный тест модуля
 * GET /modules/{moduleId}/final-test
 */
export async function GetModuleFinalTest(moduleId: string): Promise<Quiz[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/final-test`, {
      method: 'GET',
      headers: headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching final test:', error)
    throw error
  }
}

/**
 * Обновить финальный тест модуля
 * PUT /modules/{moduleId}/final-test
 */
export async function UpdateModuleFinalTest(
  moduleId: string,
  test: Quiz[],
  token: string
): Promise<Quiz[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/modules/${moduleId}/final-test`, {
      method: 'PUT',
      body: JSON.stringify(test),
      headers: { 
        ...headers, 
        Authorization: `Bearer ${token}` 
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to update final test')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating final test:', error)
    throw error
  }
}

// UTILITY Functions

/**
 * Обработка ошибок API
 */
export function handleApiError(error: any): string {
  if (error.response) {
    return error.response.data?.message || `Server error: ${error.response.status}`
  } else if (error.request) {
    return 'Network error: Unable to connect to server'
  } else {
    return error.message || 'An unexpected error occurred'
  }
}

/**
 * Проверка токена авторизации
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(atob(parts[1]))
    
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

/**
 * Получить информацию из токена
 */
export function getTokenInfo(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    return null
  }
}

// SEARCH AND FILTER Functions

/**
 * Поиск курсов по названию и описанию
 */
export async function SearchCourses(
  query: string,
  language: Language = 'ua'
): Promise<Course[]> {
  try {
    const courses = await GetCourses()
    
    if (!query.trim()) return courses
    
    const lowercaseQuery = query.toLowerCase()
    
    return courses.filter(course => {
      const name = course.name[language]?.toLowerCase() || ''
      const description = course.description[language]?.toLowerCase() || ''
      
      return name.includes(lowercaseQuery) || description.includes(lowercaseQuery)
    })
  } catch (error) {
    console.error('Error searching courses:', error)
    throw error
  }
}

/**
 * Фильтрация курсов по статусу
 */
export function FilterCoursesByStatus(
  courses: Course[],
  status: 'all' | 'completed' | 'draft' | 'active'
): Course[] {
  if (status === 'all') return courses
  
  return courses.filter(course => {
    const hasContent = course.modules && course.modules.length > 0
    const hasLessons = course.modules?.some((module: Chapter) => 
      module.lessons && module.lessons.length > 0
    )
    
    switch (status) {
      case 'completed':
        return hasContent && hasLessons
      case 'draft':
        return !hasContent || !hasLessons
      case 'active':
        return hasContent && hasLessons
      default:
        return true
    }
  })
}

/**
 * Сортировка курсов
 */
export function SortCourses(
  courses: Course[],
  sortBy: 'name' | 'date' | 'chapters',
  language: Language = 'ua'
): Course[] {
  return [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        const nameA = a.name[language] || ''
        const nameB = b.name[language] || ''
        return nameA.localeCompare(nameB)
      
      case 'chapters':
        const chaptersA = a.modules?.length || 0
        const chaptersB = b.modules?.length || 0
        return chaptersB - chaptersA
      
      case 'date':
        // Используем ID как приблизительную дату (больший ID = более новый)
        return b.id - a.id
      
      default:
        return 0
    }
  })
}

// CACHE Management

let coursesCache: Course[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

/**
 * Получить курсы с кешированием
 */
export async function GetCoursesWithCache(forceRefresh: boolean = false): Promise<Course[]> {
  const now = Date.now()
  
  if (!forceRefresh && coursesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return coursesCache
  }
  
  try {
    const courses = await GetCourses()
    coursesCache = courses
    cacheTimestamp = now
    return courses
  } catch (error) {
    if (coursesCache) {
      console.warn('Using cached data due to API error:', error)
      return coursesCache
    }
    throw error
  }
}

/**
 * Очистить кеш
 */
export function ClearCoursesCache(): void {
  coursesCache = null
  cacheTimestamp = 0
}

// BULK OPERATIONS

/**
 * Массовое удаление курсов
 */
export async function DeleteMultipleCourses(
  courseIds: string[],
  token: string
): Promise<{ success: string[], failed: string[] }> {
  const results = {
    success: [] as string[],
    failed: [] as string[]
  }
  
  for (const courseId of courseIds) {
    try {
      await DeleteCourse(courseId, token)
      results.success.push(courseId)
    } catch (error) {
      console.error(`Failed to delete course ${courseId}:`, error)
      results.failed.push(courseId)
    }
  }
  
  return results
}

/**
 * Экспорт курса в JSON
 */
export async function ExportCourse(courseId: string): Promise<string> {
  try {
    const course = await GetCourseById(courseId)
    return JSON.stringify(course, null, 2)
  } catch (error) {
    console.error('Error exporting course:', error)
    throw error
  }
}

/**
 * Импорт курса из JSON
 */
export async function ImportCourse(
  courseData: string,
  token: string
): Promise<Course> {
  try {
    const parsedCourse = JSON.parse(courseData)
    
    // Создаем курс без ID
    const { id, ...courseToCreate } = parsedCourse
    
    const newCourse = await CreateCourse(
      courseToCreate.name,
      courseToCreate.description,
      token
    )
    
    // Создаем модули/главы
    if (courseToCreate.modules && courseToCreate.modules.length > 0) {
      for (const module of courseToCreate.modules) {
        await CreateChapter(module.name, newCourse.id, token)
      }
    }
    
    return newCourse
  } catch (error) {
    console.error('Error importing course:', error)
    throw error
  }
}