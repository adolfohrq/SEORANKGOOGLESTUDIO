import { Project, InternalLink, SmartLink, ContentQueueItem, AIQuery, ProjectSettings } from '../types';

// NOTE: This data is no longer used by the application, which now fetches data from Firestore.
// It is kept here for reference purposes.

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    userId: 'user-1',
    name: 'Meu Primeiro Projeto',
    domain: 'meuprimeirosite.com.br',
    status: 'Ativo',
    wordpressStatus: 'Não Sincronizado',
    autoMode: false,
    frequency: '1/dia',
    createdAt: '30/10/2025',
  },
];

export const MOCK_INTERNAL_LINKS: InternalLink[] = [
    { id: 'il-1', userId: 'user-1', keyword: 'marketing digital', destinationUrl: '/blog/o-que-e-marketing-digital', project: 'Meu Primeiro Projeto', priority: 'Alta', isPillar: true, status: 'Ativo' },
];

export const MOCK_SMART_LINKS: SmartLink[] = [
    { id: 'sl-1', userId: 'user-1', name: 'Contato WhatsApp Vendas', type: 'Whatsapp', shortLink: 'ninjarank.com/wpp-vendas', clicks: 128, status: 'Ativo'},
];

export const MOCK_CONTENT_QUEUE: ContentQueueItem[] = [
    {id: 'cq-4', userId: 'user-1', content: 'Como criar um calendário editorial eficiente', project: 'Meu Primeiro Projeto', status: 'Na Fila', date: '25/10/2025'},
];

export const MOCK_AI_QUERIES: AIQuery[] = [
    {id: 'q-1', userId: 'user-1', keyword: 'melhor CRM para vendas', question: 'Qual o melhor CRM para equipes de vendas B2B?', frequency: 'Semanalmente', status: 'Ativo'},
];

export const MOCK_PROJECT_SETTINGS: ProjectSettings[] = MOCK_PROJECTS.map((p, index) => ({
    id: `settings-${p.id}`,
    userId: 'user-1',
    projectId: p.id,
    integrations: {
        googleSearchConsole: {
            connected: index === 1,
            account: index === 1 ? 'usuario.demo@ninjarank.com' : undefined,
            property: index === 1 ? p.domain : undefined,
        },
        googleAnalytics: {
            connected: false,
        },
    },
    wordpress: {
        url: index === 1 ? `https://${p.domain}` : '',
        username: index === 1 ? 'admin' : '',
        lastSync: index === 1 ? '29/10/2025 10:30' : undefined,
    },
    authors: index === 1 ? [
        { id: 'author-1', name: 'João da Silva', email: 'joao.silva@example.com' },
        { id: 'author-2', name: 'Maria Oliveira', email: 'maria.o@example.com' },
    ] : [],
}));