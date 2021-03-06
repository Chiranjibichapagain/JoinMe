import { SET_ERRORS, CLEAR_ERRORS } from '../../Types'

export const setErrors = (status: string, message: string) => {
  return {
    type: SET_ERRORS,
    payload: { status, message }
  }
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
