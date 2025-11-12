export enum Page {
  Dashboard = 'Dashboard',
  Projects = 'Projects',
  ContentPlanning = 'ContentPlanning',
  Content = 'Content',
  Reports = 'Reports',
  AiOverview = 'AiOverview',
  SmartLinks = 'SmartLinks',
  InternalLinks = 'InternalLinks',
  SeoAudits = 'SeoAudits',
  CRM = 'CRM',
  SocialMedia = 'SocialMedia',
  Settings = 'Settings',
}

export type Route =
  | { page: Page; view: 'list' | 'selectType' | 'manualForm' | 'intelligentForm' | 'results' | 'queries' | 'history' | 'selectProject' | 'main' }
  | { page: Page; view: 'new' }
  | { page: Page; view: 'edit'; id: string };


export interface User {
  uid: string;
  name: string;
  email: string;
  initials: string;
}

export interface Notification {
  message: string;
  type: 'success' | 'error';
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  domain: string;
  status: 'Ativo' | 'Pausado';
  wordpressStatus: 'Sincronizado' | 'Não Sincronizado';
  autoMode: boolean;
  frequency: string;
  createdAt: string;
}

export interface InternalLink {
    id: string;
    userId: string;
    keyword: string;
    destinationUrl: string;
    project: string;
    priority: 'Baixa' | 'Média' | 'Alta';
    isPillar: boolean;
    status: 'Ativo' | 'Inativo';
}

export interface SmartLink {
    id: string;
    userId: string;
    name: string;
    type: 'Whatsapp' | 'URL Externa';
    shortLink: string;
    clicks: number;
    status: 'Ativo' | 'Inativo';
}

export interface ContentQueueItem {
    id: string;
    userId: string;
    content: string;
    project: string;
    status: 'Na Fila' | 'Processando' | 'Gerado' | 'Publicado';
    date: string;
}

export interface ContentPlanResult {
    title: string;
    description: string;
    keywords: string[];
}

export interface ContentPlan {
  id: string;
  userId: string;
  name: string;
  type: 'Inteligente' | 'Manual';
  status: 'Rascunho' | 'Processando' | 'Concluído';
  project: string;
  createdAt: string;
  results: ContentPlanResult[];
}

export interface AIQuery {
  id: string;
  userId: string;
  keyword: string;
  question: string;
  frequency: 'Diariamente' | 'Semanalmente' | 'Mensalmente';
  status: 'Ativo' | 'Inativo';
}

export interface SEOAuditResult {
  score: number;
  brokenLinks: number;
  missingAlts: number;
  slowPages: number;
}

// New types for Project Settings
export interface IntegrationStatus {
    connected: boolean;
    account?: string;
    property?: string;
}

export interface WordPressSettings {
    url: string;
    username: string;
    appPassword?: string;
    lastSync?: string;
}

export interface Author {
    id: string;
    name: string;
    email: string;
}

export interface ProjectSettings {
    id: string; // Firestore document ID
    userId: string;
    projectId: string;
    integrations: {
        googleSearchConsole: IntegrationStatus;
        googleAnalytics: IntegrationStatus;
    };
    wordpress: WordPressSettings;
    authors: Author[];
}