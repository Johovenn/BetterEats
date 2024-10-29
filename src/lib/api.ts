export interface ResponseProps<T> {
	status_code: number
	message: string
	page_limit?: number
	page?: number
	total_rows?: number
	total_pages?: number
	data: T
}

export function createResponse(code: number, message: string, data: object | object[] |  null){
    return {
        status_code: code,
        message: message,
        data: data
    }
}

export function createPaginationResponse(code: number, message: string, data: object[] | null, page: number, limit: number, totalRows: number){
    return {
        status_code: code,
        message: message,
		page_limit: limit,
		page: page,
        total_rows: totalRows,
        total_pages: Math.ceil(totalRows / limit),
        data: data
    }
}