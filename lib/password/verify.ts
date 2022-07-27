import { getFirestore } from 'firebase-admin/firestore'

import admin from '../firebase/admin'
import exists from '$lib/snapshot/exists'

const firestore = getFirestore(admin)

const verifyPassword = async (password: string | null) =>
	Boolean(password) &&
	exists(await firestore.doc(`passwords/${password as string}`).get())

export default verifyPassword
