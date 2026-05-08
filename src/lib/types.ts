export type DrawType = 'brunchtime' | 'lunchtime' | 'drivetime' | 'teatime';

export const ALL_DRAW_TYPES: DrawType[] = ['brunchtime', 'lunchtime', 'drivetime', 'teatime'];

export interface DrawTypeMeta {
  key: DrawType;
  label: string;
  shortLabel: string;
  ukDrawTime: string;       // e.g. "10:49 AM"
  ukHour: number;           // 24-hour for date-rollover logic (10, 12, 16, 17)
  ukMinute: number;         // always 49
  emoji: string;
  themeColor: 'orange' | 'amber' | 'rose' | 'indigo';
  // Seed offset for predictions — keeps each draw's daily numbers distinct
  predictionSeedOffset: number;
}

export const DRAW_META: Record<DrawType, DrawTypeMeta> = {
  brunchtime: {
    key: 'brunchtime',
    label: 'Brunchtime',
    shortLabel: 'Brunch',
    ukDrawTime: '10:49 AM',
    ukHour: 10,
    ukMinute: 49,
    emoji: '🥐',
    themeColor: 'orange',
    predictionSeedOffset: 7,
  },
  lunchtime: {
    key: 'lunchtime',
    label: 'Lunchtime',
    shortLabel: 'Lunch',
    ukDrawTime: '12:49 PM',
    ukHour: 12,
    ukMinute: 49,
    emoji: '☀️',
    themeColor: 'amber',
    predictionSeedOffset: 1,
  },
  drivetime: {
    key: 'drivetime',
    label: 'Drivetime',
    shortLabel: 'Drive',
    ukDrawTime: '4:49 PM',
    ukHour: 16,
    ukMinute: 49,
    emoji: '🚗',
    themeColor: 'rose',
    predictionSeedOffset: 10,
  },
  teatime: {
    key: 'teatime',
    label: 'Teatime',
    shortLabel: 'Tea',
    ukDrawTime: '5:49 PM',
    ukHour: 17,
    ukMinute: 49,
    emoji: '🌙',
    themeColor: 'indigo',
    predictionSeedOffset: 4,
  },
};

export interface UK49sResult {
  date: string;
  drawType: DrawType;
  numbers: number[];
  booster: number;
  drawTime: string;
}

export interface DrawSchedule {
  brunchtime: string;
  lunchtime: string;
  drivetime: string;
  teatime: string;
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
  lastDrawn: string;
}

export interface HotColdNumbers {
  hot: NumberFrequency[];
  cold: NumberFrequency[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  drawType: DrawType | 'general';
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}
