const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

const localized = (lang, en, ar) => (lang === "ar" ? ar : en);

export function getMomentumState({
  progress,
  isPaused,
  mode = "work",
  language = "en",
}) {
  const safeProgress = clamp(progress);

  if (isPaused) {
    return {
      label: localized(language, "Steady Hold", "ثبات هادئ"),
      vibe: localized(language, "Paused rhythm", "إيقاع متوقف"),
      chip: localized(language, "Grounding", "ثبات"),
      bars: [0.25, 0.45, 0.35, 0.55, 0.4],
    };
  }

  if (mode === "break") {
    if (safeProgress < 20) {
      return {
        label: localized(language, "Exhale", "تنفس"),
        vibe: localized(language, "Dropping tension", "خفض التوتر"),
        chip: localized(language, "Reset", "إعادة ضبط"),
        bars: [0.2, 0.35, 0.5, 0.4, 0.3],
      };
    }
    if (safeProgress < 45) {
      return {
        label: localized(language, "Recharge", "استعادة الطاقة"),
        vibe: localized(language, "Energy rebuilding", "استرجاع النشاط"),
        chip: localized(language, "Recover", "تعاف"),
        bars: [0.3, 0.45, 0.6, 0.55, 0.4],
      };
    }
    if (safeProgress < 75) {
      return {
        label: localized(language, "Reset Complete", "اكتملت الاستعادة"),
        vibe: localized(language, "Calm and clear", "هدوء وصفاء"),
        chip: localized(language, "Ready Soon", "جاهز قريبًا"),
        bars: [0.45, 0.6, 0.75, 0.65, 0.55],
      };
    }

    return {
      label: localized(language, "Back to Motion", "عودة للحركة"),
      vibe: localized(language, "Momentum returning", "عودة الزخم"),
      chip: localized(language, "Re-enter Focus", "العودة للتركيز"),
      bars: [0.55, 0.7, 0.85, 0.8, 0.7],
    };
  }

  if (safeProgress < 20) {
    return {
      label: localized(language, "Ignition", "انطلاقة"),
      vibe: localized(language, "Entering focus", "دخول التركيز"),
      chip: localized(language, "Warm-up", "تهيئة"),
      bars: [0.25, 0.4, 0.55, 0.45, 0.35],
    };
  }
  if (safeProgress < 45) {
    return {
      label: localized(language, "Flow Rising", "تدفق متصاعد"),
      vibe: localized(language, "Concentration building", "تركيز متزايد"),
      chip: localized(language, "Locked In", "في حالة تركيز"),
      bars: [0.35, 0.55, 0.7, 0.65, 0.5],
    };
  }
  if (safeProgress < 75) {
    return {
      label: localized(language, "Deep Focus", "تركيز عميق"),
      vibe: localized(language, "Strong momentum", "زخم قوي"),
      chip: localized(language, "Peak State", "ذروة الأداء"),
      bars: [0.45, 0.65, 0.85, 0.8, 0.6],
    };
  }

  return {
    label: localized(language, "Final Push", "الدفعة الأخيرة"),
    vibe: localized(language, "Closing strong", "إنهاء قوي"),
    chip: localized(language, "Finish Line", "خط النهاية"),
    bars: [0.55, 0.75, 0.95, 0.9, 0.7],
  };
}

export function durationTagFromMinutes(minutes, language = "en") {
  if (minutes <= 15)
    return {
      label: localized(language, "Quick Spark", "شرارة سريعة"),
      tone: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300",
    };
  if (minutes <= 30)
    return {
      label: localized(language, "Flow Sprint", "دفعة تركيز"),
      tone: "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-300",
    };
  if (minutes <= 45)
    return {
      label: localized(language, "Deep Stretch", "مدى عميق"),
      tone: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300",
    };
  return {
    label: localized(language, "Marathon Mode", "وضع الماراثون"),
    tone: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-300",
  };
}

export function completionMomentTag(dateInput, language = "en") {
  const date = new Date(dateInput);
  const hour = date.getHours();

  if (hour < 6) return localized(language, "Night Owl Win", "إنجاز ليلي");
  if (hour < 12) return localized(language, "Morning Win", "إنجاز صباحي");
  if (hour < 17) return localized(language, "Afternoon Win", "إنجاز ظهيرة");
  if (hour < 21) return localized(language, "Evening Win", "إنجاز مسائي");
  return localized(language, "Late Push Win", "إنجاز متأخر");
}
