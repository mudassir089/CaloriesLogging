// src/screens/RecipeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';
import { RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../navigation/types';
import { heightPercentage } from '../utils/constants';

type RecipeScreenRouteProp = RouteProp<HomeStackParamList, 'RecipeScreen'>;

const RecipeScreen = () => {
  const route = useRoute<RecipeScreenRouteProp>();
  const { product } = route.params; // { name, image, calories, protein, carbs }
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<{ ingredients: string[]; instructions: string[] } | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      // AI se recipe lao (OpenAI ya backend API)
      try {
        const prompt = `Give me a healthy recipe for "${product.name}". Respond in JSON with "ingredients" (array of strings) and "instructions" (array of strings).`;
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer apikey`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 400,
            temperature: 0.5,
          }),
        });
        const data = await res.json();
        let content = data.choices[0]?.message?.content || '{}';
        if (content.startsWith('```')) {
          content = content.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
        }
        const parsed = JSON.parse(content);
        setRecipe(parsed);
      } catch (e) {
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [product.name]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16 }}>Generating recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load recipe. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', paddingTop: heightPercentage(10) }} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>{product.name}</Text>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionBox}><Text style={styles.nutritionValue}>{product.calories}</Text><Text style={styles.nutritionLabel}>kcal</Text></View>
        <View style={styles.nutritionBox}><Text style={styles.nutritionValue}>{product.protein}g</Text><Text style={styles.nutritionLabel}>protein</Text></View>
        <View style={styles.nutritionBox}><Text style={styles.nutritionValue}>{product.carbs}g</Text><Text style={styles.nutritionLabel}>carbs</Text></View>
      </View>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map((item: string, idx: number) => (
        <Text key={idx} style={styles.ingredient}>• {item}</Text>
      ))}
      <Text style={styles.sectionTitle}>Instructions</Text>
      {recipe.instructions.map((item: string, idx: number) => (
        <Text key={idx} style={styles.instruction}>{idx + 1}. {item}</Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  nutritionRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  nutritionBox: { alignItems: 'center', marginHorizontal: 8, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8, minWidth: 70 },
  nutritionValue: { fontSize: 18, fontWeight: 'bold' },
  nutritionLabel: { fontSize: 12, color: '#888' },
  image: { width: '100%', height: 180, borderRadius: 16, marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  ingredient: { fontSize: 16, marginBottom: 4 },
  instruction: { fontSize: 16, marginBottom: 4 },
});

export default RecipeScreen;