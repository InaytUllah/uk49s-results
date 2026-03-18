export interface UK49sResult {
  date: string;
  drawType: 'lunchtime' | 'teatime';
  numbers: number[];
  booster: number;
  drawTime: string;
}

export interface DrawSchedule {
  lunchtime: string;
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
  drawType: 'lunchtime' | 'teatime' | 'general';
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}
