import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type MealLog = {
  image?: string;
  id: string;
  date: string;
  input: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: MealType;
  items?: {
    name: string;
    image?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
};

type MacrosTotal = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MealLogContextType = {
  logs: MealLog[];
  addLog: (log: MealLog) => void;
  getMealLog: (mealType: MealType) => MealLog | undefined;
  currentMealType: MealType | null;
  setCurrentMealType: (type: MealType | null) => void;
  getLogsByDate: (date: Date) => MealLog[];
  getMealLogForDate: (mealType: MealType, date: Date) => MealLog | undefined;
  getMacrosTotalForDate: (date: Date) => MacrosTotal;
};

const MealLogContext = createContext<MealLogContextType>({
  logs: [],
  addLog: () => {},
  getMealLog: () => undefined,
  currentMealType: null,
  setCurrentMealType: () => {},
  getLogsByDate: () => [],
  getMealLogForDate: () => undefined,
  getMacrosTotalForDate: () => ({calories: 0, protein: 0, carbs: 0, fat: 0}),
});
export const useMealLog = () => useContext(MealLogContext);

export const MealLogProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [currentMealType, setCurrentMealType] = useState<MealType | null>(null);
  useEffect(() => {
    AsyncStorage.getItem('MEAL_LOGS').then(data => {
      if (data) setLogs(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('MEAL_LOGS', JSON.stringify(logs));
  }, [logs]);

const addLog = (log: MealLog) => {
  setLogs(prev => {
    const dateStr = log.date.slice(0, 10);
    const existing = prev.find(
      l => l.mealType === log.mealType && l.date.slice(0, 10) === dateStr
    );
    if (existing) {
      // Add new item to items array
      const updatedLog: MealLog = {
        ...existing,
        calories: Number(existing.calories) + Number(log.calories),
        protein: Number(existing.protein) + Number(log.protein),
        carbs: Number(existing.carbs) + Number(log.carbs),
        fat: Number(existing.fat) + Number(log.fat),
        input: existing.input + ', ' + log.input,
        items: [
          ...(existing.items || []),
          ...(log.items || [
            {
              name: log.input,
              image: log.image,
              calories: log.calories,
              protein: log.protein,
              carbs: log.carbs,
              fat: log.fat,
            },
          ]),
        ],
      };
      return [
        ...prev.filter(
          l => !(l.mealType === log.mealType && l.date.slice(0, 10) === dateStr)
        ),
        updatedLog,
      ];
    } else {
      // No previous log, just add
      return [
        ...prev,
        {
          ...log,
          items: log.items || [
            {
              name: log.input,
              image: log.image,
              calories: log.calories,
              protein: log.protein,
              carbs: log.carbs,
              fat: log.fat,
            },
          ],
        },
      ];
    }
  });
};

  const getMealLog = (mealType: MealType) =>
    logs.find(l => l.mealType === mealType);

  const getLogsByDate = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return logs.filter(log => log.date.slice(0, 10) === dateStr);
  };

  const getMealLogForDate = (mealType: MealType, date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return logs.find(
      log => log.mealType === mealType && log.date.slice(0, 10) === dateStr,
    );
  };

  const getMacrosTotalForDate = (date: Date) => {
    const logsForDate = getLogsByDate(date);
    return logsForDate.reduce(
      (acc, log) => ({
        calories: acc.calories + (Number(log.calories) || 0),
        protein: acc.protein + (Number(log.protein) || 0),
        carbs: acc.carbs + (Number(log.carbs) || 0),
        fat: acc.fat + (Number(log.fat) || 0),
      }),
      {calories: 0, protein: 0, carbs: 0, fat: 0},
    );
  };

  return (
    <MealLogContext.Provider
      value={{
        logs,
        addLog,
        getMealLog,
        currentMealType,
        setCurrentMealType,
        getLogsByDate,
        getMealLogForDate,
        getMacrosTotalForDate,
      }}>
      {children}
    </MealLogContext.Provider>
  );
};
