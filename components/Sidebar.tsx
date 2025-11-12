
import React, { useContext } from 'react';
import { Page } from '../types';
import { DashboardIcon, ProjectsIcon, ContentPlanningIcon, ContentIcon, ReportsIcon, AiOverviewIcon, SmartLinksIcon, InternalLinksIcon, SeoAuditsIcon, CrmIcon, SocialMediaIcon, FireIcon, SettingsIcon } from './Icons';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';


const Sidebar: React.FC = () => {
  const { route, navigate } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const navItems = [
    { page: Page.Dashboard, label: 'Dashboard', icon: <DashboardIcon /> },
    { page: Page.Projects, label: 'Projetos', icon: <ProjectsIcon /> },
    { page: Page.ContentPlanning, label: 'Planejamentos', icon: <ContentPlanningIcon /> },
    { page: Page.Content, label: 'Conteúdos', icon: <ContentIcon /> },
    { page: Page.Reports, label: 'Relatórios', icon: <ReportsIcon /> },
  ];

  const toolsItems = [
    { page: Page.AiOverview, label: 'AI Overview', icon: <AiOverviewIcon /> },
    { page: Page.SmartLinks, label: 'Links Inteligentes', icon: <SmartLinksIcon /> },
    { page: Page.InternalLinks, label: 'Links Internos', icon: <InternalLinksIcon /> },
    { page: Page.SeoAudits, label: 'Auditorias SEO', icon: <SeoAuditsIcon /> },
    { page: Page.CRM, label: 'CRM', icon: <CrmIcon /> },
    { page: Page.SocialMedia, label: 'Mídia Social', icon: <SocialMediaIcon /> },
    { page: Page.Settings, label: 'Configurações', icon: <SettingsIcon /> },
  ];

  const NavItem: React.FC<{item: {page: Page, label: string, icon: React.ReactNode}, isSelected: boolean}> = ({ item, isSelected }) => (
    <li>
      <button
        onClick={() => navigate({ page: item.page, view: 'list' })}
        className={`flex items-center w-full text-left p-2.5 rounded-md text-sm transition-colors duration-200 ${
          isSelected
            ? 'bg-ninja-orange text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
      >
        <span className="w-6 h-6 mr-3">{item.icon}</span>
        {item.label}
      </button>
    </li>
  );

  return (
    <aside className="w-64 bg-ninja-gray-dark text-white flex flex-col p-4">
      <div className="flex items-center mb-8">
        <span className="bg-ninja-orange p-2 rounded-md mr-3">
          <FireIcon />
        </span>
        <h1 className="text-xl font-bold">Ninja Rank</h1>
      </div>
      
      <nav className="flex-1 flex flex-col justify-between">
        <div>
          <ul className="space-y-2">
            {navItems.map(item => <NavItem key={item.page} item={item} isSelected={route.page === item.page} />)}
          </ul>
          
          <h2 className="text-xs text-gray-400 uppercase font-semibold mt-8 mb-3 px-2.5">Ferramentas</h2>
          <ul className="space-y-2">
            {toolsItems.map(item => <NavItem key={item.page} item={item} isSelected={route.page === item.page} />)}
          </ul>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-4">
          <div className="flex items-center p-2.5">
            <div className="w-10 h-10 rounded-full bg-ninja-orange flex items-center justify-center font-bold text-white mr-3">
              {user?.initials}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-400">Cliente</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
