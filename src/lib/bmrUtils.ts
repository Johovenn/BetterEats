

interface BmrCalculationProps{
    user_gender: 'M' | 'F'
    user_weight: number
    user_height: number
    user_age: number
    activity_level_multiplier: number
}

export function calculateBMR(request: BmrCalculationProps){
    let bmrValue = 0

    if(request.user_gender === 'M'){
        bmrValue = (88.362 + (13.397 * request.user_weight) + (4.799 * request.user_height) - (5.677 * request.user_age)) * request.activity_level_multiplier
    }
    else if(request.user_gender === 'F'){
        bmrValue = (447.593 + (9.247 * request.user_weight) + (3.098 * request.user_height) - (4.330 * request.user_age)) *  request.activity_level_multiplier
    }

    return Math.ceil(bmrValue)
}

export function calculateProtein(bmrValue: number){
    const proteinCalories = bmrValue * 0.3  
    const proteinGrams = proteinCalories / 4

    return Math.ceil(proteinGrams)
}

export function calculateCarbs(bmrValue: number){
    const carbsCalories = bmrValue * 0.4  
    const carbsGrams = carbsCalories / 4

    return Math.ceil(carbsGrams)
}

export function calculateFat(bmrValue: number){
    const fatCalories = bmrValue * 0.3  
    const fatGrams = fatCalories / 4

    return Math.ceil(fatGrams)
}