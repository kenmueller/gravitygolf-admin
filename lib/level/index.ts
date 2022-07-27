import type RawLevel from './raw'

export default interface Level {
	id: string
	message: string | null
	data: RawLevel
}
