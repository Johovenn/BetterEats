

interface TdeeCalculationProps{
    user_gender: 'M' | 'F'
    user_weight: number
    user_height: number
    user_age: number
    activity_level_multiplier: number
    goal_calorie_multiplier: number
}

export function calculateTDEE(request: TdeeCalculationProps){
    let tdeeValue = 0

    if(request.user_gender === 'M'){
        tdeeValue = ((9.99 * request.user_weight) + (6.25 * request.user_height) - (4.92 * request.user_age) + 5) * request.activity_level_multiplier * request.goal_calorie_multiplier
    }
    else if(request.user_gender === 'F'){
        tdeeValue = ((9.99 * request.user_weight) + (6.25 * request.user_height) - (4.92 * request.user_age) - 161) * request.activity_level_multiplier * request.goal_calorie_multiplier
    }

    return Math.ceil(tdeeValue)
}

export function calculateProtein(tdeeValue: number, multiplier: number){
    const proteinCalories = tdeeValue * multiplier
    const proteinGrams = proteinCalories / 4

    return Math.ceil(proteinGrams)
}

export function calculateCarbs(tdeeValue: number, multiplier: number){
    const carbsCalories = tdeeValue * multiplier
    const carbsGrams = carbsCalories / 4

    return Math.ceil(carbsGrams)
}

export function calculateFat(tdeeValue: number, multiplier: number){
    const fatCalories = tdeeValue * multiplier  
    const fatGrams = fatCalories / 9

    return Math.ceil(fatGrams)
}