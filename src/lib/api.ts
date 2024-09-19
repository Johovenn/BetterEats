export interface ResponseProps<T> {
	status_code: number
	message: string
	page_limit?: number
	page?: number
	total_rows?: number
	total_pages?: number
	data: T
}

export function createResponse(code: number, message: string, data: object | null){
    return {
        status_code: code,
        message: message,
        data: data
    }
}