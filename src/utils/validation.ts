export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // 至少8个字符，包含大小写字母、数字和特殊字符
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const validateUsername = (username: string): boolean => {
  // 3-16个字符，只允许字母、数字和下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/
  return usernameRegex.test(username)
}

export const validateUrl = (url: string): boolean => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return urlRegex.test(url)
}

export const validateForm = <T extends Record<string, any>>(
  formData: T, 
  validationRules: { [K in keyof T]?: (value: T[K]) => boolean }
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors = {} as Partial<Record<keyof T, string>>

  Object.keys(validationRules).forEach((key) => {
    const value = formData[key]
    const validate = validationRules[key]

    if (validate && !validate(value)) {
      switch (key) {
        case 'email':
          errors[key as keyof T] = 'Invalid email address'
          break
        case 'password':
          errors[key as keyof T] = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
          break
        case 'username':
          errors[key as keyof T] = 'Username must be 3-16 characters with letters, numbers, and underscores'
          break
        default:
          errors[key as keyof T] = 'Invalid input'
      }
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
} 