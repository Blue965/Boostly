export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageConfig {
  id: string;
  user_id: string;
  title: string | null;
  theme: string;
  background_color: string;
  accent_color: string;
  button_style: 'rounded' | 'pill' | 'square' | 'outline';
  font_family: string;
  hide_branding: boolean;
  created_at: string;
  updated_at: string;
}

export interface LinkItem {
  id: string;
  page_id: string;
  title: string;
  url: string;
  icon?: string | null;
  image_url?: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_end: string | null;
}

export interface AnalyticsSummary {
  views: number;
  clicks: number;
  ctr: number;
  popularLinks: Array<{ link_id: string; title: string; clicks: number; url: string }>;
}