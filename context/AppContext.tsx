import React, { createContext, useState, useEffect, useContext } from 'react';
import { Route, Page, Project, InternalLink, SmartLink, ContentQueueItem, ContentPlan, Notification, AIQuery, ProjectSettings } from '../types';
import { db } from '../firebase-config';
import { AuthContext } from './AuthContext';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';


interface AppContextType {
  route: Route;
  navigate: (route: Route) => void;
  notification: Notification | null;
  showNotification: (notification: Notification) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'userId'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  internalLinks: InternalLink[];
  addInternalLink: (link: Omit<InternalLink, 'id' | 'userId'>) => Promise<void>;
  updateInternalLink: (link: InternalLink) => Promise<void>;
  deleteInternalLink: (id: string) => Promise<void>;
  smartLinks: SmartLink[];
  addSmartLink: (link: Omit<SmartLink, 'id' | 'userId'>) => Promise<void>;
  updateSmartLink: (link: SmartLink) => Promise<void>;
  deleteSmartLink: (id: string) => Promise<void>;
  contentQueue: ContentQueueItem[];
  contentPlans: ContentPlan[];
  addContentPlan: (plan: Omit<ContentPlan, 'id' | 'userId'>) => Promise<void>;
  deleteContentPlan: (id: string) => Promise<void>;
  aiQueries: AIQuery[];
  addAIQuery: (query: Omit<AIQuery, 'id' | 'userId'>) => Promise<void>;
  updateAIQuery: (query: AIQuery) => Promise<void>;
  deleteAIQuery: (id: string) => Promise<void>;
  projectSettings: ProjectSettings[];
  updateProjectSettings: (settings: ProjectSettings) => Promise<void>;
  loading: boolean;
}

export const AppContext = createContext<AppContextType>(null!);

// Helper to fetch a collection for a user
// FIX: Refactored to a standard async function declaration to resolve parsing errors.
async function fetchCollection<T>(collectionName: string, userId: string): Promise<T[]> {
    const q = query(collection(db, collectionName), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [route, setRoute] = useState<Route>({ page: Page.Dashboard, view: 'main' });
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  // State for all data models
  const [projects, setProjects] = useState<Project[]>([]);
  const [internalLinks, setInternalLinks] = useState<InternalLink[]>([]);
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([]);
  const [contentQueue, setContentQueue] = useState<ContentQueueItem[]>([]);
  const [contentPlans, setContentPlans] = useState<ContentPlan[]>([]);
  const [aiQueries, setAiQueries] = useState<AIQuery[]>([]);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings[]>([]);
  
  const fetchData = async (userId: string) => {
    setLoading(true);
    try {
        const [projectsData, internalLinksData, smartLinksData, contentQueueData, contentPlansData, aiQueriesData, projectSettingsData] = await Promise.all([
            fetchCollection<Project>('projects', userId),
            fetchCollection<InternalLink>('internalLinks', userId),
            fetchCollection<SmartLink>('smartLinks', userId),
            fetchCollection<ContentQueueItem>('contentQueue', userId),
            fetchCollection<ContentPlan>('contentPlans', userId),
            fetchCollection<AIQuery>('aiQueries', userId),
            fetchCollection<ProjectSettings>('projectSettings', userId),
        ]);
        setProjects(projectsData);
        setInternalLinks(internalLinksData);
        setSmartLinks(smartLinksData);
        setContentQueue(contentQueueData);
        setContentPlans(contentPlansData);
        setAiQueries(aiQueriesData);
        setProjectSettings(projectSettingsData);
    } catch (error) {
        console.error("Error fetching data:", error);
        showNotification({ message: 'Erro ao carregar os dados.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchData(user.uid);
    } else {
      // Clear data on logout
      setProjects([]);
      setInternalLinks([]);
      setSmartLinks([]);
      setContentQueue([]);
      setContentPlans([]);
      setAiQueries([]);
      setProjectSettings([]);
      setLoading(false);
    }
  }, [user]);


  const navigate = (newRoute: Route) => setRoute(newRoute);
  const showNotification = (notif: Notification) => {
    setNotification(notif);
    setTimeout(() => setNotification(null), 3000);
  };

  // CRUD Operations
  const addProject = async (projectData: Omit<Project, 'id' | 'userId'>) => {
    if (!user) return;
    const newProjectRef = await addDoc(collection(db, 'projects'), { ...projectData, userId: user.uid });
    // Also create default settings for this project
    await addDoc(collection(db, 'projectSettings'), {
      userId: user.uid,
      projectId: newProjectRef.id,
      integrations: { googleSearchConsole: { connected: false }, googleAnalytics: { connected: false } },
      wordpress: { url: '', username: '' },
      authors: [],
    });
    await fetchData(user.uid); // Refetch all data
    showNotification({ message: 'Projeto criado com sucesso!', type: 'success' });
    navigate({ page: Page.Projects, view: 'list' });
  };
  const updateProject = async (project: Project) => {
    if (!user) return;
    const { id, ...projectData } = project;
    await updateDoc(doc(db, 'projects', id), projectData);
    await fetchData(user.uid);
    showNotification({ message: 'Projeto atualizado com sucesso!', type: 'success' });
    navigate({ page: Page.Projects, view: 'list' });
  };
  const deleteProject = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'projects', id));
    // Also delete associated settings
    const settingsQuery = query(collection(db, 'projectSettings'), where("projectId", "==", id), where("userId", "==", user.uid));
    const settingsSnapshot = await getDocs(settingsQuery);
    const batch = writeBatch(db);
    settingsSnapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    await fetchData(user.uid);
    showNotification({ message: 'Projeto excluído com sucesso!', type: 'success' });
  };
  
  const addInternalLink = async (linkData: Omit<InternalLink, 'id'|'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'internalLinks'), { ...linkData, userId: user.uid });
    await fetchData(user.uid);
    showNotification({ message: 'Link interno salvo!', type: 'success' });
    navigate({ page: Page.InternalLinks, view: 'list' });
  };
  const updateInternalLink = async (link: InternalLink) => {
    if (!user) return;
    const { id, ...linkData } = link;
    await updateDoc(doc(db, 'internalLinks', id), linkData);
    await fetchData(user.uid);
    showNotification({ message: 'Link interno atualizado!', type: 'success' });
    navigate({ page: Page.InternalLinks, view: 'list' });
  };
  const deleteInternalLink = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'internalLinks', id));
    await fetchData(user.uid);
    showNotification({ message: 'Link interno excluído!', type: 'success' });
  };

  const addSmartLink = async (linkData: Omit<SmartLink, 'id'|'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'smartLinks'), { ...linkData, userId: user.uid });
    await fetchData(user.uid);
    showNotification({ message: 'Link inteligente salvo!', type: 'success' });
    navigate({ page: Page.SmartLinks, view: 'list' });
  };
  const updateSmartLink = async (link: SmartLink) => {
    if (!user) return;
    const { id, ...linkData } = link;
    await updateDoc(doc(db, 'smartLinks', id), linkData);
    await fetchData(user.uid);
    showNotification({ message: 'Link inteligente atualizado!', type: 'success' });
    navigate({ page: Page.SmartLinks, view: 'list' });
  };
  const deleteSmartLink = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'smartLinks', id));
    await fetchData(user.uid);
    showNotification({ message: 'Link inteligente excluído!', type: 'success' });
  };

  const addContentPlan = async (planData: Omit<ContentPlan, 'id' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'contentPlans'), { ...planData, userId: user.uid });
    await fetchData(user.uid);
    showNotification({ message: 'Planejamento salvo com sucesso!', type: 'success' });
    navigate({ page: Page.ContentPlanning, view: 'list' });
  };
  const deleteContentPlan = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'contentPlans', id));
    await fetchData(user.uid);
    showNotification({ message: 'Planejamento excluído!', type: 'success' });
  };

  const addAIQuery = async (queryData: Omit<AIQuery, 'id' | 'userId'>) => {
    if (!user) return;
    await addDoc(collection(db, 'aiQueries'), { ...queryData, userId: user.uid });
    await fetchData(user.uid);
    showNotification({ message: 'Query salva!', type: 'success' });
    navigate({ page: Page.AiOverview, view: 'queries' });
  };
  const updateAIQuery = async (query: AIQuery) => {
    if (!user) return;
    const { id, ...queryData } = query;
    await updateDoc(doc(db, 'aiQueries', id), queryData);
    await fetchData(user.uid);
    showNotification({ message: 'Query atualizada!', type: 'success' });
    navigate({ page: Page.AiOverview, view: 'queries' });
  };
  const deleteAIQuery = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'aiQueries', id));
    await fetchData(user.uid);
    showNotification({ message: 'Query excluída!', type: 'success' });
  };
  
  const updateProjectSettings = async (settings: ProjectSettings) => {
    if (!user) return;
    const { id, ...settingsData } = settings;
    await updateDoc(doc(db, 'projectSettings', id), settingsData);
    await fetchData(user.uid);
    showNotification({ message: 'Configurações salvas!', type: 'success'});
  };

  return (
    <AppContext.Provider value={{ 
        route, navigate, notification, showNotification,
        projects, addProject, updateProject, deleteProject,
        internalLinks, addInternalLink, updateInternalLink, deleteInternalLink,
        smartLinks, addSmartLink, updateSmartLink, deleteSmartLink,
        contentQueue,
        contentPlans, addContentPlan, deleteContentPlan,
        aiQueries, addAIQuery, updateAIQuery, deleteAIQuery,
        projectSettings, updateProjectSettings,
        loading,
    }}>
      {children}
    </AppContext.Provider>
  );
};