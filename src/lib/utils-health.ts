// Utilitários para cálculos de saúde e nutrição

import { ActivityLevel, Gender } from './types';

// Calcular TMB (Taxa Metabólica Basal) usando fórmula de Harris-Benedict
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

// Calcular calorias diárias necessárias baseado no nível de atividade
export function calculateDailyCalories(
  bmr: number,
  activityLevel: ActivityLevel,
  targetWeight: number,
  currentWeight: number
): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * activityMultipliers[activityLevel];
  
  // Se quer perder peso, reduz 500 calorias (perda de ~0.5kg/semana)
  if (currentWeight > targetWeight) {
    return Math.round(tdee - 500);
  }
  
  // Se quer ganhar peso, adiciona 300 calorias
  if (currentWeight < targetWeight) {
    return Math.round(tdee + 300);
  }
  
  // Manutenção
  return Math.round(tdee);
}

// Calcular IMC
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

// Classificação do IMC
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

// Calcular progresso em porcentagem
export function calculateProgress(
  currentWeight: number,
  targetWeight: number,
  initialWeight: number
): number {
  const totalToLose = Math.abs(initialWeight - targetWeight);
  const lostSoFar = Math.abs(initialWeight - currentWeight);
  return Math.round((lostSoFar / totalToLose) * 100);
}

// Formatar data para exibição
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Gerar ID único simples
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
