export class DatabaseError extends Error {
	public status: number
	public details: any
	constructor(message: string, status: number, stack?: string, details?: any) {
		super(message)
		this.name = 'DatabaseError'
		this.stack = stack
		this.status = status
		this.details = details
	}
}
