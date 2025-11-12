
import React, { useContext } from 'react';
import { Page, Route } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/pages/Dashboard';
import Projects from './components/pages/Projects';
import ContentPlanning from './components/pages/ContentPlanning';
import ContentQueue from './components/pages/ContentQueue';
import Reports from './components/pages/Reports';
import AiOverview from './components/pages/AiOverview';
import SmartLinks from './components/pages/SmartLinks';
import InternalLinks from './components/pages/InternalLinks';
import SeoAudits from './components/pages/SeoAudits';
import Crm from './components/pages/Crm';
import SocialMedia from './components/pages/SocialMedia';
import Login from './components/pages/Login';
import Settings from './components/pages/Settings';
import { AuthContext } from './context/AuthContext';
import { AppContext } from './context/AppContext';
import Notification from './components/Notification';

const App: React.FC = () => {
  const auth = useContext(AuthContext);
  const { route, navigate, notification } = useContext(AppContext);

  if (!auth?.user) {
    return <Login />;
  }

  const renderPage = () => {
    const pageProps = { navigate, route };
    switch (route.page) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Projects:
        return <Projects />;
      case Page.ContentPlanning:
        return <ContentPlanning />;
      case Page.Content:
        return <ContentQueue />;
      case Page.Reports:
        return <Reports />;
      case Page.AiOverview:
        return <AiOverview />;
      case Page.SmartLinks:
        return <SmartLinks />;
      case Page.InternalLinks:
        return <InternalLinks />;
      case Page.SeoAudits:
        return <SeoAudits />;
      case Page.CRM:
        return <Crm />;
      case Page.SocialMedia:
        return <SocialMedia />;
      case Page.Settings:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };
  
  const pageTitles: { [key in Page]: string } = {
    [Page.Dashboard]: 'Dashboard',
    [Page.Projects]: 'Projetos',
    [Page.ContentPlanning]: 'Planejamentos de Conteúdo',
    [Page.Content]: 'Fila de Conteúdos',
    [Page.Reports]: 'Relatórios Estratégicos de SEO',
    [Page.AiOverview]: 'AI Overview Monitoring',
    [Page.SmartLinks]: 'Links Inteligentes',
    [Page.InternalLinks]: 'Links Internos',
    [Page.SeoAudits]: 'Auditorias de SEO Técnico',
    [Page.CRM]: 'CRM',
    [Page.SocialMedia]: 'Mídia Social',
    [Page.Settings]: 'Configurações do Projeto',
  };

  return (
    <div className="flex h-screen bg-ninja-gray-light font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header title={pageTitles[route.page]} />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderPage()}
        </div>
      </main>
      {notification && <Notification message={notification.message} type={notification.type} />}
    </div>
  );
};

export default App;
