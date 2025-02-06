

interface BmiCalculationProps{
    user_gender: 'M' | 'F'
    user_weight: number
    user_height: number
    user_age: number
}

export function calculateBMI(request: BmiCalculationProps): number{
    return parseFloat((request.user_weight / (Math.pow((request.user_height / 100), 2))).toFixed(1))
}

export function getRecommendationBasedOnBMI(bmi_value: number): string {
    if (bmi_value < 16) {
        return "Based on your BMI, you are considered underweight. It's important to consult with a healthcare provider to determine the underlying causes. Consider incorporating nutrient-dense foods into your diet to reach a healthier weight.";
    } else if (bmi_value >= 16 && bmi_value < 18.5) {
        return "Based on your BMI, you are slightly underweight. It's recommended for you to gain a little more weight.";
    } else if (bmi_value >= 18.5 && bmi_value < 24.9) {
        return "Based on your BMI, you are in the ideal range. Keep up the good work by maintaining a balanced diet and regular physical activity to stay healthy.";
    }else if (bmi_value >= 25 && bmi_value < 29.9) {
        return "Based on your BMI, you are slightly overweight. You may want to consider a healthier diet and increased physical activity to prevent future health risks.";
    } else if (bmi_value >= 30 && bmi_value < 34.9) {
        return "Based on your BMI, you fall in the obesity range (Class 1). It's important to consult a healthcare provider to create a plan for managing your weight. A balanced diet and regular exercise are key.";
    } else if (bmi_value >= 35 && bmi_value < 39.9) {
        return "Based on your BMI, you fall in the obesity range (Class 2). Managing your weight at this stage is critical for reducing the risk of chronic diseases. Seek professional advice for a comprehensive weight-loss plan.";
    } else {
        return "Based on your BMI, you are in the severe obesity range (Class 3). It's highly recommended to seek medical advice and make lifestyle changes to reduce health risks associated with high BMI.";
    }
}
