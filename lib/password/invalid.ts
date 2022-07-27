import HttpError from '$lib/error/http'
import ErrorCode from '$lib/error/code'

const invalidPassword = new HttpError(ErrorCode.Forbidden, 'Invalid password')

export default invalidPassword
