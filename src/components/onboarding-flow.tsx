'use client';

import { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, DietaryPreference } from '@/lib/types';
import { calculateBMR, calculateDailyCalories, generateId } from '@/lib/utils-health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, User, Activity, Target, Utensils } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Dados do formulário
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const bmr = calculateBMR(
      Number(currentWeight),
      Number(height),
      Number(age),
      gender
    );

    const dailyCalories = calculateDailyCalories(
      bmr,
      activityLevel,
      Number(targetWeight),
      Number(currentWeight)
    );

    const profile: UserProfile = {
      id: generateId(),
      name,
      age: Number(age),
      gender,
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      height: Number(height),
      activityLevel,
      dietaryPreferences,
      dailyCalorieGoal: dailyCalories,
      createdAt: new Date(),
    };

    onComplete(profile);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return name.trim() !== '' && age !== '' && Number(age) > 0;
      case 2:
        return currentWeight !== '' && targetWeight !== '' && height !== '' &&
               Number(currentWeight) > 0 && Number(targetWeight) > 0 && Number(height) > 0;
      case 3:
        return true; // Activity level tem valor padrão
      case 4:
        return true; // Preferências são opcionais
      default:
        return false;
    }
  };

  const toggleDietaryPreference = (pref: DietaryPreference) => {
    setDietaryPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">FJ</span>
              </div>
              <div>
                <CardTitle className="text-2xl">FitJourney</CardTitle>
                <CardDescription>Sua jornada de saúde começa aqui</CardDescription>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Passo {step} de {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Informações Básicas */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Informações Básicas</h3>
                  <p className="text-sm text-muted-foreground">Vamos conhecer você melhor</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Ex: 30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Sexo</Label>
                    <RadioGroup value={gender} onValueChange={(v) => setGender(v as Gender)}>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">Feminino</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Medidas e Metas */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Medidas e Metas</h3>
                  <p className="text-sm text-muted-foreground">Defina seus objetivos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentWeight">Peso atual (kg)</Label>
                    <Input
                      id="currentWeight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 75.5"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetWeight">Meta de peso (kg)</Label>
                    <Input
                      id="targetWeight"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 70.0"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {currentWeight && targetWeight && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-sm font-medium text-emerald-900">
                      {Number(currentWeight) > Number(targetWeight) 
                        ? `Meta: Perder ${(Number(currentWeight) - Number(targetWeight)).toFixed(1)} kg`
                        : Number(currentWeight) < Number(targetWeight)
                        ? `Meta: Ganhar ${(Number(targetWeight) - Number(currentWeight)).toFixed(1)} kg`
                        : 'Meta: Manter peso atual'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Nível de Atividade */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Nível de Atividade</h3>
                  <p className="text-sm text-muted-foreground">Como é sua rotina?</p>
                </div>
              </div>

              <RadioGroup value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
                <div className="space-y-3">
                  {[
                    { value: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                    { value: 'light', label: 'Levemente ativo', desc: 'Exercício leve 1-3 dias/semana' },
                    { value: 'moderate', label: 'Moderadamente ativo', desc: 'Exercício moderado 3-5 dias/semana' },
                    { value: 'active', label: 'Muito ativo', desc: 'Exercício intenso 6-7 dias/semana' },
                    { value: 'very_active', label: 'Extremamente ativo', desc: 'Exercício muito intenso diariamente' },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        activityLevel === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActivityLevel(option.value as ActivityLevel)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={option.value} className="cursor-pointer font-medium">
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 4: Preferências Alimentares */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Preferências Alimentares</h3>
                  <p className="text-sm text-muted-foreground">Selecione suas restrições (opcional)</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { value: 'vegetarian', label: 'Vegetariano', desc: 'Sem carne' },
                  { value: 'vegan', label: 'Vegano', desc: 'Sem produtos de origem animal' },
                  { value: 'pescatarian', label: 'Pescatariano', desc: 'Apenas peixes e frutos do mar' },
                  { value: 'keto', label: 'Keto', desc: 'Baixo carboidrato, alto gordura' },
                  { value: 'paleo', label: 'Paleo', desc: 'Alimentos não processados' },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      dietaryPreferences.includes(option.value as DietaryPreference)
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleDietaryPreference(option.value as DietaryPreference)}
                  >
                    <Checkbox
                      checked={dietaryPreferences.includes(option.value as DietaryPreference)}
                      onCheckedChange={() => toggleDietaryPreference(option.value as DietaryPreference)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label className="cursor-pointer font-medium">{option.label}</Label>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              {step === totalSteps ? 'Começar Jornada' : 'Próximo'}
              {step < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
