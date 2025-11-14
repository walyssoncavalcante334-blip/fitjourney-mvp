'use client';

import { UserProfile, FoodEntry } from '@/lib/types';
import { calculateBMI, getBMICategory } from '@/lib/utils-health';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, TrendingDown, Activity, Flame, User, LogOut } from 'lucide-react';
import FoodLogger from './food-logger';

interface DashboardProps {
  profile: UserProfile;
  todayEntries: FoodEntry[];
  onAddFood: (food: FoodEntry) => void;
  onDeleteFood: (foodId: string) => void;
  onLogout: () => void;
}

export default function Dashboard({ profile, todayEntries, onAddFood, onDeleteFood, onLogout }: DashboardProps) {
  const totalCaloriesToday = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const caloriesRemaining = profile.dailyCalorieGoal - totalCaloriesToday;
  const progressPercentage = Math.min((totalCaloriesToday / profile.dailyCalorieGoal) * 100, 100);

  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiCategory = getBMICategory(bmi);

  const weightDifference = Math.abs(profile.currentWeight - profile.targetWeight);
  const isLosingWeight = profile.currentWeight > profile.targetWeight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Olá, {profile.name}!</h1>
                <p className="text-emerald-100 text-sm">Sua jornada de saúde</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Calorias do dia */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2">
                  {totalCaloriesToday}
                  <span className="text-2xl text-emerald-100"> / {profile.dailyCalorieGoal}</span>
                </div>
                <p className="text-emerald-100">calorias consumidas hoje</p>
              </div>

              <Progress value={progressPercentage} className="h-3 bg-white/20" />

              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  <span>
                    {caloriesRemaining > 0
                      ? `${caloriesRemaining} kcal restantes`
                      : `${Math.abs(caloriesRemaining)} kcal acima da meta`}
                  </span>
                </div>
                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Peso Atual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profile.currentWeight} kg</div>
              <p className="text-sm text-muted-foreground mt-1">
                Meta: {profile.targetWeight} kg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                {isLosingWeight ? 'A Perder' : 'A Ganhar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{weightDifference.toFixed(1)} kg</div>
              <p className="text-sm text-muted-foreground mt-1">
                Faltam para a meta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                IMC
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bmi}</div>
              <p className="text-sm text-muted-foreground mt-1">{bmiCategory}</p>
            </CardContent>
          </Card>
        </div>

        {/* Food Logger */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Alimentação</CardTitle>
            <CardDescription>
              Registre suas refeições para acompanhar seu progresso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FoodLogger
              userId={profile.id}
              onAddFood={onAddFood}
              todayEntries={todayEntries}
              onDeleteFood={onDeleteFood}
            />
          </CardContent>
        </Card>

        {/* Informações do Perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Seu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Idade</p>
                <p className="font-semibold">{profile.age} anos</p>
              </div>
              <div>
                <p className="text-muted-foreground">Altura</p>
                <p className="font-semibold">{profile.height} cm</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sexo</p>
                <p className="font-semibold capitalize">
                  {profile.gender === 'male' ? 'Masculino' : 'Feminino'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Nível de Atividade</p>
                <p className="font-semibold capitalize">
                  {profile.activityLevel.replace('_', ' ')}
                </p>
              </div>
              {profile.dietaryPreferences.length > 0 && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Preferências Alimentares</p>
                  <p className="font-semibold capitalize">
                    {profile.dietaryPreferences.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
