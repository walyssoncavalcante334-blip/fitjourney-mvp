'use client';

import { useState, useEffect } from 'react';
import { UserProfile, FoodEntry } from '@/lib/types';
import OnboardingFlow from '@/components/onboarding-flow';
import Dashboard from '@/components/dashboard';
import { Toaster } from 'sonner';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('fitjourney_profile');
    const savedEntries = localStorage.getItem('fitjourney_entries');

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    if (savedEntries) {
      setFoodEntries(JSON.parse(savedEntries));
    }

    setIsLoading(false);
  }, []);

  // Salvar perfil no localStorage
  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('fitjourney_profile', JSON.stringify(newProfile));
  };

  // Adicionar alimento
  const handleAddFood = (food: FoodEntry) => {
    const updatedEntries = [...foodEntries, food];
    setFoodEntries(updatedEntries);
    localStorage.setItem('fitjourney_entries', JSON.stringify(updatedEntries));
  };

  // Deletar alimento
  const handleDeleteFood = (foodId: string) => {
    const updatedEntries = foodEntries.filter(entry => entry.id !== foodId);
    setFoodEntries(updatedEntries);
    localStorage.setItem('fitjourney_entries', JSON.stringify(updatedEntries));
  };

  // Logout (limpar dados)
  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair? Seus dados serão mantidos.')) {
      setProfile(null);
    }
  };

  // Filtrar entradas de hoje
  const getTodayEntries = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return foodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">FJ</span>
          </div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {!profile ? (
        <OnboardingFlow onComplete={handleCompleteOnboarding} />
      ) : (
        <Dashboard
          profile={profile}
          todayEntries={getTodayEntries()}
          onAddFood={handleAddFood}
          onDeleteFood={handleDeleteFood}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
