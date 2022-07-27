import { getFirestore } from 'firebase-admin/firestore'

import admin from '../firebase/admin'

const firestore = getFirestore(admin)

const verifyPassword = async (password: string | null) =>
	Boolean(password) &&
	(await firestore.doc(`passwords/${password as string}`).get()).exists

export default verifyPassword
