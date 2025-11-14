'use client';

import { useState } from 'react';
import { FoodEntry } from '@/lib/types';
import { generateId } from '@/lib/utils-health';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Scan, Utensils, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FoodLoggerProps {
  userId: string;
  onAddFood: (food: FoodEntry) => void;
  todayEntries: FoodEntry[];
  onDeleteFood: (foodId: string) => void;
}

export default function FoodLogger({ userId, onAddFood, todayEntries, onDeleteFood }: FoodLoggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  // Manual entry state
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  // Barcode scanner state
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const resetForm = () => {
    setFoodName('');
    setQuantity('');
    setUnit('g');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setMealType('lunch');
    setBarcode('');
  };

  const handleManualSubmit = () => {
    if (!foodName || !quantity || !calories) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const newEntry: FoodEntry = {
      id: generateId(),
      userId,
      foodName,
      quantity: Number(quantity),
      unit,
      calories: Number(calories),
      protein: protein ? Number(protein) : undefined,
      carbs: carbs ? Number(carbs) : undefined,
      fat: fat ? Number(fat) : undefined,
      mealType,
      timestamp: new Date(),
    };

    onAddFood(newEntry);
    toast.success(`${foodName} adicionado!`);
    resetForm();
    setIsOpen(false);
  };

  const handleBarcodeSubmit = () => {
    if (!barcode) {
      toast.error('Digite o código de barras');
      return;
    }

    setIsScanning(true);

    // Simulação de busca de produto (em produção, usar API real como OpenFoodFacts)
    setTimeout(() => {
      // Dados simulados baseados no código de barras
      const mockProducts: Record<string, any> = {
        '7891000100103': { name: 'Leite Integral 1L', calories: 640, protein: 32, carbs: 48, fat: 32, unit: 'ml', quantity: 1000 },
        '7896004700014': { name: 'Arroz Branco 1kg', calories: 1300, protein: 26, carbs: 280, fat: 2, unit: 'g', quantity: 100 },
        '7891000053508': { name: 'Chocolate ao Leite 90g', calories: 480, protein: 6, carbs: 60, fat: 24, unit: 'g', quantity: 90 },
      };

      const product = mockProducts[barcode];

      if (product) {
        setFoodName(product.name);
        setQuantity(product.quantity.toString());
        setUnit(product.unit);
        setCalories(product.calories.toString());
        setProtein(product.protein.toString());
        setCarbs(product.carbs.toString());
        setFat(product.fat.toString());
        setActiveTab('manual');
        toast.success('Produto encontrado!');
      } else {
        toast.error('Produto não encontrado. Tente inserir manualmente.');
      }

      setIsScanning(false);
      setBarcode('');
    }, 1500);
  };

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Café da manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const groupedEntries = todayEntries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Refeição
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Alimento</DialogTitle>
            <DialogDescription>
              Escaneie o código de barras ou insira manualmente
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scanner">
                <Scan className="h-4 w-4 mr-2" />
                Scanner
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Utensils className="h-4 w-4 mr-2" />
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner" className="space-y-4">
              <div className="space-y-4">
                <div className="p-8 border-2 border-dashed rounded-lg text-center space-y-4">
                  <div className="h-24 w-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                    <Scan className="h-12 w-12 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Escaneie o código de barras</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Digite o código de barras do produto
                    </p>
                    <div className="max-w-sm mx-auto space-y-3">
                      <Input
                        placeholder="Ex: 7891000100103"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        disabled={isScanning}
                      />
                      <Button
                        onClick={handleBarcodeSubmit}
                        disabled={isScanning}
                        className="w-full"
                      >
                        {isScanning ? 'Buscando...' : 'Buscar Produto'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Códigos de teste:</strong> 7891000100103, 7896004700014, 7891000053508
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foodName">Nome do alimento *</Label>
                  <Input
                    id="foodName"
                    placeholder="Ex: Arroz integral"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Ex: 100"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">gramas (g)</SelectItem>
                        <SelectItem value="ml">mililitros (ml)</SelectItem>
                        <SelectItem value="un">unidade</SelectItem>
                        <SelectItem value="col">colher</SelectItem>
                        <SelectItem value="xic">xícara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calorias (kcal) *</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="Ex: 130"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein">Proteína (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="Ex: 2.6"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carboidrato (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="Ex: 28"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fat">Gordura (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      placeholder="Ex: 0.2"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealType">Tipo de refeição</Label>
                  <Select value={mealType} onValueChange={(v) => setMealType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Café da manhã</SelectItem>
                      <SelectItem value="lunch">Almoço</SelectItem>
                      <SelectItem value="dinner">Jantar</SelectItem>
                      <SelectItem value="snack">Lanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleManualSubmit} className="w-full">
                  Adicionar Alimento
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Lista de refeições do dia */}
      {Object.keys(groupedEntries).length > 0 && (
        <div className="space-y-3">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
            const entries = groupedEntries[mealType];
            if (!entries || entries.length === 0) return null;

            const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

            return (
              <Card key={mealType}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{getMealTypeLabel(mealType)}</CardTitle>
                    <span className="text-sm font-semibold text-emerald-600">
                      {totalCalories} kcal
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{entry.foodName}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.quantity} {entry.unit} • {entry.calories} kcal
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onDeleteFood(entry.id);
                          toast.success('Alimento removido');
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
