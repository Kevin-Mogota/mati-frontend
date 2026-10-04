import { REGIONS, CROPS, MONTH_NAMES } from "./data";

export function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}


export function buildRainfallSeries(region, yearOffset = 0) {
  const r = REGIONS[region];
  const series = [];
  for (let m = 0; m < 12; m++) {
    const monthNum = m + 1;
    let mm = 0;
    if (monthNum >= r.rainStart && monthNum <= r.rainEnd) {
      const mid = (r.rainStart + r.rainEnd) / 2;
      const spread = (r.rainEnd - r.rainStart) / 2 || 1;
      const bell = Math.exp(-Math.pow((monthNum - mid) / spread, 2));
      const noise = 0.75 + seeded(monthNum * 13 + region.length * 3 + yearOffset * 97) * 0.5;
      mm = Math.round(r.rainPeakMM * bell * noise);
    } else {
      mm = Math.round(seeded(monthNum * 7 + region.length + yearOffset * 51) * 4);
    }
    series.push({ month: MONTH_NAMES[m], mm, monthNum });
  }
  return series;
}


export function currentMonthNum() { return new Date().getMonth() + 1; }

// Maps the Django /api/advisory/ JSON shape onto the same shape computeAdvice() returns,
// so components never need to know whether data came from the backend or the local fallback.

export function mapBackendAdvisory(data) {
  return {
    sowingAdvice: data.sowing_advice, sowingLevel: data.sowing_level,
    irrigationAdvice: data.irrigation_advice, irrigationLevel: data.irrigation_level,
    riskAdvice: data.risk_advice, riskLevel: data.risk_level,
    droughtIndex: data.drought_index,
    droughtLevel: data.rain_ratio >= 0.9 ? "ok" : data.rain_ratio >= 0.6 ? "watch" : "alert",
    rainRatio: data.rain_ratio, thisMonthRain: data.this_month_rain_mm, totalSeasonRain: data.total_season_rain_mm,
    rain: data.rain_series.map(r => ({ month: r.month, mm: r.mm, monthNum: r.month_num })),
    now: currentMonthNum(), source: "backend",
  };
}


export function computeAdvice(region, crop) {
  const r = REGIONS[region];
  const c = CROPS[crop];
  const now = currentMonthNum();

  // Region/crop not in the local Tchad dataset (e.g. a country added by the admin,
  // only known to the backend) — return a neutral placeholder rather than crash;
  // the AI chat assistant can still give general guidance for it.
  if (!r || !c) {
    return {
      sowingAdvice: "Données locales non disponibles pour cette région/culture — connectez-vous au backend pour un conseil calculé, ou demandez à l'assistant IA.",
      sowingLevel: "watch",
      irrigationAdvice: "Données locales non disponibles pour cette région/culture.",
      irrigationLevel: "watch",
      riskAdvice: "Données locales non disponibles pour cette région/culture.",
      riskLevel: "watch",
      droughtIndex: "Inconnu", droughtLevel: "watch",
      rainRatio: 0, thisMonthRain: 0, totalSeasonRain: 0,
      rain: MONTH_NAMES.map((m, i) => ({ month: m, mm: 0, monthNum: i + 1 })),
      now, source: "unavailable",
    };
  }

  const rain = buildRainfallSeries(region, 0);
  const thisMonthRain = rain.find((x) => x.monthNum === now)?.mm ?? 0;
  const totalSeasonRain = rain
    .filter((x) => x.monthNum >= r.rainStart && x.monthNum <= r.rainEnd)
    .reduce((a, b) => a + b.mm, 0);

  const inSowWindow = now >= c.sowWindow[0] && now <= c.sowWindow[1];
  const beforeSowWindow = now < c.sowWindow[0];
  const afterSowWindow = now > c.sowWindow[1] && now <= r.rainEnd;
  const rainRatio = totalSeasonRain / c.minRainMM;

  let sowingAdvice, sowingLevel;
  if (inSowWindow) {
    sowingAdvice = "Fenêtre de semis optimale pour le " + crop.toLowerCase() + " : semer dès un cumul de pluie utile d'au moins 20 mm sur 3 jours consécutifs.";
    sowingLevel = "go";
  } else if (beforeSowWindow) {
    sowingAdvice = "Trop tôt : la fenêtre de semis pour le " + crop.toLowerCase() + " à " + region + " commence en " + MONTH_NAMES[c.sowWindow[0]-1] + ". Préparer les parcelles en attendant.";
    sowingLevel = "wait";
  } else if (afterSowWindow) {
    sowingAdvice = "Fenêtre de semis dépassée pour un cycle plein. Un semis tardif à cycle court reste possible, avec un risque accru de fin de saison sèche avant maturité.";
    sowingLevel = "risk";
  } else {
    sowingAdvice = "Hors saison des pluies à " + region + " — aucun semis pluvial recommandé actuellement.";
    sowingLevel = "risk";
  }

  let irrigationAdvice, irrigationLevel;
  if (thisMonthRain < 30 && now >= r.rainStart - 1 && now <= r.rainEnd) {
    irrigationAdvice = "Déficit hydrique probable ce mois-ci (~" + thisMonthRain + " mm estimés). Irrigation d'appoint ou paillage conseillés pour un besoin " + c.waterNeed.toLowerCase() + ".";
    irrigationLevel = "alert";
  } else if (thisMonthRain >= 30 && thisMonthRain < 80) {
    irrigationAdvice = "Pluviométrie modérée estimée (~" + thisMonthRain + " mm). Surveiller l'humidité du sol ; irrigation possible après 10 jours sans pluie.";
    irrigationLevel = "watch";
  } else {
    irrigationAdvice = "Pluviométrie estimée suffisante ce mois-ci (~" + thisMonthRain + " mm). Pas d'irrigation d'appoint nécessaire dans l'immédiat.";
    irrigationLevel = "ok";
  }

  const droughtIndex = rainRatio >= 0.9 ? "Faible" : rainRatio >= 0.6 ? "Modéré" : "Sévère";

  const riskAdvice = rainRatio >= 0.75
    ? "Cumul saisonnier estimé (" + totalSeasonRain + " mm) proche des besoins du " + crop.toLowerCase() + " (" + c.minRainMM + " mm). Risque climatique modéré cette saison."
    : "Cumul saisonnier estimé (" + totalSeasonRain + " mm) en-dessous du besoin du " + crop.toLowerCase() + " (" + c.minRainMM + " mm). Envisager une variété plus résistante ou une diversification.";

  return {
    sowingAdvice, sowingLevel, irrigationAdvice, irrigationLevel,
    riskAdvice, riskLevel: rainRatio >= 0.75 ? "watch" : "alert",
    droughtIndex, droughtLevel: rainRatio >= 0.9 ? "ok" : rainRatio >= 0.6 ? "watch" : "alert",
    rainRatio, thisMonthRain, totalSeasonRain, rain, now, source: "local",
  };
}

// Tries the Django /api/advisory/ endpoint; falls back to the local simulation
// (computeAdvice above) if the backend is unreachable or returns an error.

export function buildMultiYearTotals(region) {
  const r = REGIONS[region];
  if (!r) return [];
  const years = [2021, 2022, 2023, 2024, 2025];
  return years.map((y, i) => {
    const s = buildRainfallSeries(region, i + 1);
    const total = s.filter(x => x.monthNum >= r.rainStart && x.monthNum <= r.rainEnd).reduce((a,b)=>a+b.mm,0);
    return { year: String(y), total };
  });
}


export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


export async function diagnoseImageDirect(base64, mediaType, region, crop) {
  const systemPrompt = "Tu es phytopathologiste, spécialiste des cultures vivrières sahéliennes (sorgho, mil, arachide, maïs). " +
    "On te montre une photo prise par un agriculteur au Tchad (culture : " + crop + ", région : " + region + "). " +
    "Réponds en français, en 4 parties courtes et clairement séparées par des titres en MAJUSCULES : " +
    "OBSERVATION (ce que tu vois sur l'image, 1-2 phrases), " +
    "DIAGNOSTIC PROBABLE (maladie, ravageur, carence ou stress hydrique — avec un niveau de confiance : faible/moyen/élevé), " +
    "RECOMMANDATION (action concrète et réalisable en zone rurale, 2-3 phrases), " +
    "LIMITE (rappelle en une phrase que ce diagnostic est indicatif et qu'un avis d'un agent agricole local reste recommandé en cas de doute ou de propagation rapide).";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Merci d'analyser cette photo de culture." },
        ],
      }],
    }),
  });
  const data = await res.json();
  return (data.content || []).map(b => b.type === "text" ? b.text : "").join("\n").trim();
}


export function parseDiagnosis(text) {
  const grab = (label, nextLabels) => {
    const idx = text.indexOf(label);
    if (idx === -1) return "";
    let rest = text.slice(idx + label.length);
    for (const n of nextLabels) {
      const ni = rest.indexOf(n);
      if (ni !== -1) rest = rest.slice(0, ni);
    }
    return rest.replace(/^[:\s]+/, "").trim();
  };
  return {
    observation: grab("OBSERVATION", ["DIAGNOSTIC PROBABLE", "DIAGNOSTIC", "RECOMMANDATION", "LIMITE"]),
    diagnostic: grab("DIAGNOSTIC PROBABLE", ["RECOMMANDATION", "LIMITE"]) || grab("DIAGNOSTIC", ["RECOMMANDATION", "LIMITE"]),
    recommandation: grab("RECOMMANDATION", ["LIMITE"]),
    limite: grab("LIMITE", []),
  };
}


/* ============================================================================
   FORUM — post problems, comment, like. Requires an account to post/comment/
   like (enforced by the backend); reading works even signed out.
============================================================================ */
