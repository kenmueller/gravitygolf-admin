import type { RequestHandler } from '@sveltejs/kit'
import { getFirestore } from 'firebase-admin/firestore'

import type Locals from '$lib/locals'
import admin from '$lib/firebase/admin'
import verifyPassword from '$lib/password/verify'
import invalidPassword from '$lib/password/invalid'
import HttpError from '$lib/error/http'
import ErrorCode from '$lib/error/code'
import errorFromValue from '$lib/error/from/value'

const firestore = getFirestore(admin)

export const POST: RequestHandler = async ({
	request,
	params: { id },
	locals
}) => {
	try {
		if (!(await verifyPassword((locals as Locals).password)))
			throw invalidPassword

		if (request.headers.get('content-type') !== 'application/json')
			throw new HttpError(ErrorCode.BadRequest, 'Must be JSON')

		const message = (await request.json()) as string | null

		if (!(typeof message === 'string' || message === null))
			throw new HttpError(ErrorCode.BadRequest, 'Invalid message')

		await firestore.doc(`levels/${id}`).update({
			message: message || null
		})

		return { body: '' }
	} catch (value) {
		const { code, message } = errorFromValue(value)
		return { status: code, body: message }
	}
}
