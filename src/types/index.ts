export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

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
