// Tipos do FitJourney MVP

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  currentWeight: number;
  targetWeight: number;
  height: number;
  activityLevel: ActivityLevel;
  dietaryPreferences: DietaryPreference[];
  dailyCalorieGoal: number;
  createdAt: Date;
}

export interface FoodEntry {
  id: string;
  userId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
  barcode?: string;
}

export interface DailyProgress {
  date: Date;
  caloriesConsumed: number;
  caloriesGoal: number;
  mealsLogged: number;
  weight?: number;
}
