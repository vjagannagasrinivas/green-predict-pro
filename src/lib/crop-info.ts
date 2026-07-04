export interface CropInfo {
  key: string;
  name: string;
  emoji: string;
  description: string;
  season: string;
  soil: string;
  water: string;
  fertilizer: string;
  tips: string;
  yield: string;
}

export const CROP_INFO: Record<string, CropInfo> = {
  rice: { key: "rice", name: "Rice", emoji: "🌾", description: "Staple cereal thriving in flooded paddies and warm, humid climates.", season: "Kharif (Jun–Nov)", soil: "Clayey, water-retentive alluvial", water: "High — 1200–1800 mm", fertilizer: "N:P:K 120:60:40, split N in 3 doses", tips: "Maintain 2–5 cm standing water during vegetative stage; drain 10 days before harvest.", yield: "4.5–6.5 t/ha" },
  maize: { key: "maize", name: "Maize", emoji: "🌽", description: "Versatile C4 cereal; tolerates a wide temperature band and moderate rainfall.", season: "Kharif & Rabi", soil: "Well-drained loam", water: "500–800 mm", fertilizer: "N:P:K 120:60:40; top-dress N at knee-high", tips: "Sow at 60×20 cm; earth-up at 30 days to prevent lodging.", yield: "5–8 t/ha" },
  chickpea: { key: "chickpea", name: "Chickpea", emoji: "🫘", description: "Cool-season pulse — fixes nitrogen and prefers low humidity.", season: "Rabi (Oct–Mar)", soil: "Well-drained sandy loam", water: "Low — 400 mm", fertilizer: "N:P:K 20:40:20 + Rhizobium seed treatment", tips: "Avoid excess irrigation; one light watering at pod-fill boosts yield.", yield: "1.2–2 t/ha" },
  kidneybeans: { key: "kidneybeans", name: "Kidney Beans", emoji: "🫘", description: "Cool, well-drained conditions with moderate rainfall.", season: "Kharif hill / Rabi plains", soil: "Loamy, pH 5.5–6.5", water: "300–400 mm", fertilizer: "N:P:K 40:80:40", tips: "Do not water-log; stake climbers for airflow.", yield: "1.5–2.5 t/ha" },
  pigeonpeas: { key: "pigeonpeas", name: "Pigeon Peas", emoji: "🫛", description: "Deep-rooted pulse tolerant to dry spells and varied soils.", season: "Kharif", soil: "Well-drained loam", water: "600–1000 mm", fertilizer: "N:P:K 20:50:20 + Rhizobium", tips: "Intercrop with sorghum or cotton for extra income.", yield: "1–1.8 t/ha" },
  mothbeans: { key: "mothbeans", name: "Moth Beans", emoji: "🌱", description: "Drought-hardy legume for arid tropics.", season: "Kharif", soil: "Sandy, low fertility tolerated", water: "300–400 mm", fertilizer: "N:P:K 10:30:0", tips: "Excellent cover crop; harvest before pod shatter.", yield: "0.5–0.9 t/ha" },
  mungbean: { key: "mungbean", name: "Mung Bean", emoji: "🫛", description: "Short-duration pulse (60–75 days) suited to warm humid weather.", season: "Kharif & Zaid", soil: "Loamy, pH 6.2–7.2", water: "350–500 mm", fertilizer: "N:P:K 20:40:20", tips: "Harvest in 2–3 pickings as pods mature unevenly.", yield: "0.8–1.2 t/ha" },
  blackgram: { key: "blackgram", name: "Black Gram", emoji: "⚫", description: "Warm-season pulse used across South Asian cuisines.", season: "Kharif & Rabi", soil: "Well-drained clay loam", water: "600–750 mm", fertilizer: "N:P:K 25:50:0", tips: "Apply Rhizobium & PSB inoculants for higher nodulation.", yield: "0.8–1.2 t/ha" },
  lentil: { key: "lentil", name: "Lentil", emoji: "🫘", description: "Cool-season pulse — excellent nitrogen fixer.", season: "Rabi", soil: "Loamy, well-drained", water: "300–400 mm", fertilizer: "N:P:K 20:40:20 + S 20", tips: "Sow shallow (3–4 cm); one irrigation at flowering suffices.", yield: "1–1.5 t/ha" },
  pomegranate: { key: "pomegranate", name: "Pomegranate", emoji: "🍎", description: "Drought-tolerant fruit crop with high market value.", season: "Perennial", soil: "Deep loam, pH 6.5–7.5", water: "Drip 4–8 L/day/plant", fertilizer: "N:P:K 625:250:250 g/plant/yr", tips: "Bahar treatment (Mrig/Hasta/Ambe) controls flowering season.", yield: "10–15 t/ha" },
  banana: { key: "banana", name: "Banana", emoji: "🍌", description: "Heavy feeder — needs warm, humid weather year-round.", season: "Perennial (plant Jun–Aug)", soil: "Rich loam, pH 6–7.5", water: "High — drip 15–20 L/day", fertilizer: "N:P:K 200:60:300 g/plant", tips: "De-sucker regularly; prop plants at bunch emergence.", yield: "40–60 t/ha" },
  mango: { key: "mango", name: "Mango", emoji: "🥭", description: "Long-lived tropical fruit tree thriving on well-drained soils.", season: "Perennial (harvest Apr–Jul)", soil: "Deep alluvial or lateritic", water: "Drip during fruit development", fertilizer: "N:P:K 1000:500:1000 g/tree (bearing)", tips: "Avoid irrigation 2–3 months pre-flowering to induce bloom.", yield: "8–15 t/ha" },
  grapes: { key: "grapes", name: "Grapes", emoji: "🍇", description: "Vine crop needing hot dry summers and cool winters.", season: "Perennial (harvest Feb–Apr)", soil: "Well-drained sandy loam", water: "Drip 8–12 L/vine/day", fertilizer: "N:P:K 500:500:1000 g/vine", tips: "Prune to maintain 60–90 canes/vine for balanced yield.", yield: "20–25 t/ha" },
  watermelon: { key: "watermelon", name: "Watermelon", emoji: "🍉", description: "Warm-season vine loving sandy soils and sunny days.", season: "Zaid (Feb–May)", soil: "Sandy loam, pH 6–7", water: "400–600 mm", fertilizer: "N:P:K 100:50:50", tips: "Mulch to conserve moisture; stop irrigation 7 days before harvest.", yield: "20–35 t/ha" },
  muskmelon: { key: "muskmelon", name: "Muskmelon", emoji: "🍈", description: "Sweet melon needing hot, dry weather with high humidity at fruiting.", season: "Zaid", soil: "Sandy loam", water: "Furrow — 8–10 irrigations", fertilizer: "N:P:K 80:60:60", tips: "Train vines and remove side shoots for larger fruits.", yield: "15–25 t/ha" },
  apple: { key: "apple", name: "Apple", emoji: "🍏", description: "Temperate fruit needing 1000+ chilling hours below 7 °C.", season: "Perennial (harvest Aug–Oct)", soil: "Loam, pH 5.5–6.5", water: "Drip; 1100 mm/yr", fertilizer: "N:P:K 70:35:70 g/yr/age", tips: "Prune in dormancy; use pollinizers every 3rd row.", yield: "20–35 t/ha" },
  orange: { key: "orange", name: "Orange", emoji: "🍊", description: "Sub-tropical citrus with strong fragrance and heavy vitamin C.", season: "Perennial (harvest Nov–Feb)", soil: "Well-drained loam, pH 6–7.5", water: "Drip 30–50 L/day", fertilizer: "N:P:K 600:300:600 g/tree", tips: "Watch for citrus psylla; use yellow sticky traps.", yield: "10–15 t/ha" },
  papaya: { key: "papaya", name: "Papaya", emoji: "🥭", description: "Fast-growing fruit — first harvest in 9–11 months.", season: "Plant Feb–Mar or Sep–Oct", soil: "Well-drained loam", water: "Drip 8 L/day", fertilizer: "N:P:K 250:250:500 g/plant/yr", tips: "Keep ring basins dry to prevent collar rot.", yield: "40–100 t/ha" },
  coconut: { key: "coconut", name: "Coconut", emoji: "🥥", description: "Tropical palm producing year-round on coastal soils.", season: "Perennial", soil: "Sandy loam near coast", water: "Drip 40 L/day", fertilizer: "N:P:K 500:320:1200 g/palm/yr", tips: "Husk mulching conserves moisture in dry months.", yield: "80–120 nuts/palm/yr" },
  cotton: { key: "cotton", name: "Cotton", emoji: "☁️", description: "Fibre crop — needs a long, warm growing season.", season: "Kharif", soil: "Deep black cotton soil", water: "700–1200 mm", fertilizer: "N:P:K 120:60:60", tips: "Scout for pink bollworm weekly; use pheromone traps.", yield: "1.5–2.5 t/ha lint" },
  jute: { key: "jute", name: "Jute", emoji: "🌿", description: "Bast fibre crop for warm, humid Gangetic plains.", season: "Kharif", soil: "Alluvial, silty loam", water: "1000–1500 mm", fertilizer: "N:P:K 60:30:30", tips: "Ret fibres in clean flowing water for 10–15 days for best lustre.", yield: "2.5–3.5 t/ha" },
  coffee: { key: "coffee", name: "Coffee", emoji: "☕", description: "Shade-loving perennial for high-altitude tropics.", season: "Perennial (harvest Nov–Feb)", soil: "Deep, well-drained loam", water: "1500–2000 mm", fertilizer: "N:P:K 140:90:140 kg/ha", tips: "Grow under silver-oak shade; blossom irrigation triggers uniform flowering.", yield: "0.8–1.2 t/ha (arabica)" },
};

export function getCropInfo(key: string): CropInfo {
  return (
    CROP_INFO[key] ?? {
      key,
      name: key,
      emoji: "🌱",
      description: "A recommended crop for your input conditions.",
      season: "—",
      soil: "—",
      water: "—",
      fertilizer: "—",
      tips: "—",
      yield: "—",
    }
  );
}
