import RNFS from 'react-native-fs';

export async function analyzeMealWithOpenAI(text: string, imagePath?: string) {
  const apiKey =
    'api-key';
  let prompt = text
    ? `
You are a nutrition expert. Please recognize any food or drink item described in the following ${text}, no matter how it is written. The user may make spelling mistakes, use informal language, or phrase things differently. Even if the description contains typos, unclear terms, or vague language, you should still try to identify it as a food or drink item and provide the following nutritional information: calories, protein, carbs, and fat.

Your task is to analyze the text and estimate the nutritional information. Even if the spelling is wrong, informal, or unclear, Please **ONLY** respond with **JSON data** in the following format (no markdown or code blocks):

{"calories":<number>, "protein":<number>, "carbs":<number>, "fat":<number>}

If the input is not a food or drink item, respond ONLY with {"error":"Not a food item"}.
`
    : `
You are a nutrition expert. Please recognize any food or drink item in the following image, no matter how it is presented. The image may contain different food items or be unclear in terms of appearance. Even if the image is of low quality or contains unusual items, you should still try to identify it as a food or drink item and provide the following nutritional information: calories, protein, carbs, and fat.

Your task is to analyze the image and estimate the nutritional information. Even if the image is unclear or ambiguous, Please **ONLY** respond with **JSON data** in the following format (no markdown or code blocks):

{"name":"<food name>", "calories":<number>, "protein":<number>, "carbs":<number>, "fat":<number>}

If the image does not contain a recognizable food or drink item, respond ONLY with {"error":"Not a food item"}.
`;

  let imageBase64 = '';
  if (imagePath) {
    imageBase64 = await RNFS.readFile(imagePath, 'base64');
  }

  const body: any = {
    model: imagePath ? 'gpt-4o' : 'gpt-3.5-turbo',
    messages: imagePath
      ? [
          {
            role: 'user',
            content: [
              {type: 'text', text: prompt},
              {
                type: 'image_url',
                image_url: {url: `data:image/jpeg;base64,${imageBase64}`},
              },
            ],
          },
        ]
      : [{role: 'user', content: prompt}],
    max_tokens: 100,
    temperature: 0.2,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  try {
    const data = await response.json();
    console.log('data>>>', data);

    if (data.error) {
      return {error: data?.error?.message || 'Something went wrong'};
    }
    let textResponse = data.choices[0]?.message?.content || '{}';
    console.log('textResponse', textResponse);
    console.log('textResponse1', textResponse.trim());
    console.log('textResponse2', JSON.parse(textResponse));

    textResponse = textResponse.trim();
    if (textResponse.startsWith('```')) {
      textResponse = textResponse
        .replace(/```[a-zA-Z]*\n?/, '')
        .replace(/```$/, '')
        .trim();
    }
    let parsed;
    try {
      parsed = JSON.parse(textResponse);
    } catch (e) {
      return {error: 'Could not parse response from AI.'};
    }
    if (parsed.error) {
      return {error: parsed.error};
    }
    return {
      name: parsed.name || '',
      calories: Number(parsed.calories) || 0,
      protein: Number(parsed.protein) || 0,
      carbs: Number(parsed.carbs) || 0,
      fat: Number(parsed.fat) || 0,
    };
  } catch (e) {
    return {error: 'Failed to analyze meal.'};
  }
}
