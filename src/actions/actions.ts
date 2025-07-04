import { Language, Quiz } from '../constants/interfaces'

const url: string =
  process.env.REACT_APP_SERVER_URL || 'http://192.168.1.14:3004'

const headers = {
  'Content-Type': 'application/json',
}

// AUTH

export async function Register(email: string, password: string) {
  try {
    const urlAddress = `${url}/auth/register`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
      }),
      headers: headers,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Unknown error')
    }

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function VerifyEmail(email: string, token: string) {
  const urlAddress = `${url}/auth/verify-email`

  const response = await fetch(urlAddress, {
    method: 'POST',
    body: JSON.stringify({
      email: email.toLowerCase(),
      token: token,
    }),
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function LogIn(email: string, password: string) {
  const urlAddress = `${url}/auth/login`

  const response = await fetch(urlAddress, {
    method: 'POST',
    body: JSON.stringify({
      email: email.toLowerCase(),
      password: password,
    }),
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function VerifyLoginCode(
  email: string,
  verificationToken: string
) {
  const urlAddress = `${url}/auth/verify-login-code`

  const response = await fetch(urlAddress, {
    method: 'POST',
    body: JSON.stringify({
      email: email.toLowerCase(),
      verificationToken: verificationToken,
    }),
    headers: headers,
  })

  const data = await response.json()

  return data
}

// LESSONS

export async function PostLesson(lesson: FormData, token: string) {
  try {
    const urlAddress = `${url}/lessons`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: lesson,
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function GetAllLessonsInChapter(chapterId: string) {
  const urlAddress = `${url}/modules/${chapterId}/lessons`

  const response = await fetch(urlAddress, {
    method: 'GET',
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function GetLessonById(id: string) {
  const urlAddress = `${url}/lessons/${id}`

  const response = await fetch(urlAddress, {
    method: 'GET',
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function UpdateLesson(
  id: string,
  lesson: FormData,
  token: string
) {
  try {
    const urlAddress = `${url}/lessons/${id}`

    const response = await fetch(urlAddress, {
      method: 'PUT',
      body: lesson,
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function DeleteLesson(id: string, token: string) {
  try {
    const urlAddress = `${url}/lessons/${id}`

    const response = await fetch(urlAddress, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

// FINAL TEST

export async function GetChapterFinalTest(chapterId: string) {
  const urlAddress = `${url}/modules/${chapterId}/final-test`

  const response = await fetch(urlAddress, {
    method: 'GET',
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function PostFinalTest(test: Quiz[], chapterId: number) {
  const urlAddress = `${url}/modules/${chapterId}/final-test`

  const response = await fetch(urlAddress, {
    method: 'PUT',
    body: JSON.stringify(test),
    headers: headers,
  })

  const data = await response.json()
  return data
}

// MODULES

export async function GetAllChapterInCourse(courseId: number) {
  const urlAddress = `${url}/modules/course/${courseId}`

  const response = await fetch(urlAddress, {
    method: 'GET',
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function PostChapter(
  name: Record<Language, string>,
  courseId: number,
  accessToken: string
) {
  try {
    const urlAddress = `${url}/modules`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        courseId: courseId,
        finalTest: [],
      }),
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function GetChapterById(chapterId: string) {
  const urlAddress = `${url}/modules/course/${chapterId}`

  const response = await fetch(urlAddress, {
    method: 'GET',
    headers: headers,
  })

  const data = await response.json()
  return data
}

// COURSES

export async function GetCourses() {
  const urlAddress = `${url}/courses`

  const response = await fetch(urlAddress, {
    method: 'GET',
    headers: headers,
  })

  const data = await response.json()
  return data
}

export async function PostCourse(
  name: Record<Language, string>,
  description: Record<Language, string>,
  token: string
) {
  try {
    const urlAddress = `${url}/courses`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: { ...headers, Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function GetCourseById(id: string) {
  try {
    const urlAddress = `${url}/courses/${id}`
    const response = await fetch(urlAddress, {
      method: 'GET',
      headers: headers,
    })
    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

// ADMIN

export async function AdminRegister(
  email: string,
  password: string,
  token: string
) {
  try {
    const urlAddress = `${url}/admin/register`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
      }),
      headers: { ...headers, Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function AdminLogin(email: string, password: string) {
  try {
    const urlAddress = `${url}/admin/login`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: JSON.stringify({
        email: email.toLowerCase(),
        password: password,
      }),
      headers: headers, // TODO check this
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

// SWIPE TRADE

export async function GetAllSwipeTrade(accessToken: string) {
  try {
    const urlAddress = `${url}/chart-quiz`
    const response = await fetch(urlAddress, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function PostSwipeTrade(quiz: any, accessToken: string) {
  try {
    const urlAddress = `${url}/chart-quiz`

    const response = await fetch(urlAddress, {
      method: 'POST',
      body: JSON.stringify(quiz),
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function UpdateSwipeTrade(
  id: number,
  quiz: any,
  accessToken: string
) {
  try {
    const urlAddress = `${url}/chart-quiz/${id}`

    const response = await fetch(urlAddress, {
      method: 'PATCH',
      body: JSON.stringify(quiz),
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function GetSwipeTradeStatistics(accessToken: string) {
  try {
    const urlAddress = `${url}/chart-quiz/stats`

    const response = await fetch(urlAddress, {
      method: 'Get',
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}

export async function DeleteSwipeTrade(id: number, accessToken: string) {
  try {
    const urlAddress = `${url}/chart-quiz/${id}`

    const response = await fetch(urlAddress, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error }
  }
}
