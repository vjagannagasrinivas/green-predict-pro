// Lightweight, dataset-inspired crop recommender.
// Mirrors the classic "Crop Recommendation" dataset (Kaggle) — 22 crops,
// features: N, P, K (mg/kg), temperature (°C), humidity (%), pH, rainfall (mm).
// Each crop has a typical range; we score inputs by how well they fit each
// range and return the top match plus a confidence. When a real Flask/sklearn
// backend is available (VITE_ML_API_URL), we call it instead.

export interface CropInputs {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

interface Profile {
  key: string;
  N: [number, number];
  P: [number, number];
  K: [number, number];
  temperature: [number, number];
  humidity: [number, number];
  ph: [number, number];
  rainfall: [number, number];
}

// Ranges derived from the public Crop Recommendation dataset means/stds.
const PROFILES: Profile[] = [
  { key: "rice", N: [60, 99], P: [35, 60], K: [35, 45], temperature: [20, 27], humidity: [80, 85], ph: [5.5, 7], rainfall: [180, 300] },
  { key: "maize", N: [60, 100], P: [35, 60], K: [15, 25], temperature: [18, 27], humidity: [55, 75], ph: [5.5, 7], rainfall: [60, 110] },
  { key: "chickpea", N: [20, 60], P: [55, 80], K: [75, 85], temperature: [17, 21], humidity: [14, 20], ph: [6, 8], rainfall: [65, 100] },
  { key: "kidneybeans", N: [10, 40], P: [55, 80], K: [15, 25], temperature: [15, 25], humidity: [18, 25], ph: [5, 6.5], rainfall: [60, 150] },
  { key: "pigeonpeas", N: [10, 40], P: [55, 80], K: [15, 25], temperature: [18, 37], humidity: [30, 70], ph: [4.5, 7.5], rainfall: [90, 200] },
  { key: "mothbeans", N: [10, 40], P: [35, 60], K: [15, 25], temperature: [24, 32], humidity: [40, 65], ph: [3.5, 10], rainfall: [40, 150] },
  { key: "mungbean", N: [10, 40], P: [35, 60], K: [15, 25], temperature: [27, 30], humidity: [80, 90], ph: [6, 7.5], rainfall: [40, 80] },
  { key: "blackgram", N: [20, 60], P: [55, 80], K: [15, 25], temperature: [25, 35], humidity: [60, 70], ph: [6.5, 7.5], rainfall: [60, 70] },
  { key: "lentil", N: [10, 40], P: [55, 80], K: [15, 25], temperature: [18, 27], humidity: [60, 70], ph: [5.5, 7.5], rainfall: [45, 75] },
  { key: "pomegranate", N: [10, 40], P: [10, 40], K: [35, 45], temperature: [18, 25], humidity: [85, 92], ph: [5.5, 7.5], rainfall: [80, 130] },
  { key: "banana", N: [80, 120], P: [70, 95], K: [45, 55], temperature: [25, 30], humidity: [75, 85], ph: [5.5, 7], rainfall: [90, 120] },
  { key: "mango", N: [10, 40], P: [15, 35], K: [25, 40], temperature: [27, 36], humidity: [45, 55], ph: [4.5, 7], rainfall: [80, 100] },
  { key: "grapes", N: [10, 40], P: [120, 145], K: [195, 205], temperature: [8, 42], humidity: [80, 85], ph: [5.5, 6.5], rainfall: [65, 80] },
  { key: "watermelon", N: [80, 120], P: [10, 25], K: [45, 55], temperature: [24, 27], humidity: [80, 92], ph: [6, 7], rainfall: [40, 60] },
  { key: "muskmelon", N: [80, 120], P: [10, 25], K: [45, 55], temperature: [27, 30], humidity: [90, 95], ph: [6, 7], rainfall: [20, 30] },
  { key: "apple", N: [10, 40], P: [120, 145], K: [195, 205], temperature: [21, 24], humidity: [90, 95], ph: [5.5, 6.5], rainfall: [100, 125] },
  { key: "orange", N: [10, 40], P: [5, 25], K: [5, 15], temperature: [10, 35], humidity: [90, 95], ph: [6, 7.5], rainfall: [100, 120] },
  { key: "papaya", N: [30, 70], P: [45, 70], K: [45, 55], temperature: [23, 43], humidity: [90, 95], ph: [6.5, 7], rainfall: [40, 250] },
  { key: "coconut", N: [10, 40], P: [10, 30], K: [25, 35], temperature: [25, 30], humidity: [90, 100], ph: [5.5, 7], rainfall: [130, 200] },
  { key: "cotton", N: [100, 140], P: [35, 65], K: [15, 25], temperature: [22, 26], humidity: [75, 85], ph: [5.8, 8], rainfall: [60, 100] },
  { key: "jute", N: [60, 100], P: [35, 60], K: [35, 45], temperature: [23, 27], humidity: [70, 90], ph: [6, 7.5], rainfall: [150, 200] },
  { key: "coffee", N: [80, 120], P: [15, 35], K: [25, 35], temperature: [23, 28], humidity: [50, 70], ph: [6, 7.5], rainfall: [140, 200] },
];

const WEIGHTS: Record<keyof CropInputs, number> = {
  N: 1,
  P: 1,
  K: 1,
  temperature: 1.4,
  humidity: 1.4,
  ph: 0.8,
  rainfall: 1.4,
};

function featureFit(value: number, [lo, hi]: [number, number]): number {
  if (value >= lo && value <= hi) return 1;
  const span = Math.max(hi - lo, 1);
  const dist = value < lo ? lo - value : value - hi;
  // Soft falloff — 1 span outside → ~0.37, 2 spans → ~0.14
  return Math.exp(-(dist / span));
}

function scoreProfile(inputs: CropInputs, p: Profile): number {
  let s = 0;
  let w = 0;
  (Object.keys(WEIGHTS) as (keyof CropInputs)[]).forEach((k) => {
    const weight = WEIGHTS[k];
    s += weight * featureFit(inputs[k], p[k]);
    w += weight;
  });
  return s / w;
}

export interface Prediction {
  crop: string;
  confidence: number; // 0..1
  runnerUps: Array<{ crop: string; confidence: number }>;
  source: "local" | "api";
}

export function predictLocally(inputs: CropInputs): Prediction {
  const scored = PROFILES.map((p) => ({ crop: p.key, score: scoreProfile(inputs, p) })).sort(
    (a, b) => b.score - a.score,
  );
  // Softmax-ish normalization across top 5 for a comparable confidence
  const top = scored.slice(0, 5);
  const expVals = top.map((t) => Math.exp(t.score * 6));
  const sum = expVals.reduce((a, b) => a + b, 0);
  const normalized = top.map((t, i) => ({ crop: t.crop, confidence: expVals[i] / sum }));
  const [best, ...rest] = normalized;
  return { crop: best.crop, confidence: best.confidence, runnerUps: rest.slice(0, 3), source: "local" };
}

export async function predictCrop(inputs: CropInputs): Promise<Prediction> {
  const apiUrl = import.meta.env.VITE_ML_API_URL as string | undefined;
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          crop: string;
          confidence: number;
          runnerUps?: Array<{ crop: string; confidence: number }>;
        };
        return {
          crop: data.crop,
          confidence: data.confidence,
          runnerUps: data.runnerUps ?? [],
          source: "api",
        };
      }
    } catch (err) {
      console.warn("[OptiCrop] ML API unreachable, falling back to on-device model", err);
    }
  }
  return predictLocally(inputs);
}
