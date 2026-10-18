export type ThemeMode = 'daydream' | 'midnight';

export interface LanternVariant {
  id: string;
  name: string;
  glowColor: string;
  textColor: string;
  ambientFilter: string;
  description: string;
  vibe: string;
}

export interface DreamDeliveryStop {
  id: number;
  label: string;
  recipient: string;
  dreamType: string;
  x: number;
  y: number;
}
