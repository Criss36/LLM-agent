export interface Demo {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  tags: string[];
  code?: string;
  status: 'live' | 'coming' | 'concept';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readTime: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface TimelineEvent {
  period: string;
  event: string;
}

export interface Model {
  name: string;
  provider: string;
  params: string;
  context: string;
  commercial: boolean;
}

export interface Framework {
  name: string;
  type: '微调' | '推理' | '应用';
  description: string;
}

export interface Evaluation {
  name: string;
  scope: string;
}