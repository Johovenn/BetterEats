

interface BmrCalculationProps{
    user_gender: 'M' | 'F'
    user_weight: number
    user_height: number
    user_age: number
}

export function calculateBMI(request: BmrCalculationProps){
    return request.user_weight / (Math.pow(request.user_height, 2))
}