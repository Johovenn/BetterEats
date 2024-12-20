
export function formatDate(date: Date){
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export function formatDateTime(date: Date){
    return date.toUTCString()
    // return date.toString().replace(/-/g, '\/').replace(/T.+/, '')
}