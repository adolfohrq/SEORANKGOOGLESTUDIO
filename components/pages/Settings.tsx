import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import { Project, ProjectSettings, Author } from '../../types';
import { GoogleSearchConsoleIcon, GoogleAnalyticsIcon, EditIcon, TrashIcon, PlusIcon, SpinnerIcon } from '../Icons';

const Settings: React.FC = () => {
  const { projects, projectSettings, updateProjectSettings, showNotification } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects.length > 0 ? projects[0].id : null);
  const [currentSettings, setCurrentSettings] = useState<ProjectSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'integrations' | 'wordpress' | 'authors'>('integrations');
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);
  
  useEffect(() => {
    if (selectedProjectId) {
      const settings = projectSettings.find(s => s.projectId === selectedProjectId);
      // Use structuredClone for a deep copy to prevent mutation of original context state
      setCurrentSettings(settings ? structuredClone(settings) : null);
    } else {
      setCurrentSettings(null);
    }
  }, [selectedProjectId, projectSettings]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProjectId(e.target.value);
  };
  
  const handleIntegrationToggle = (service: 'googleSearchConsole' | 'googleAnalytics') => {
      if (!currentSettings) return;

      setLoading({ ...loading, [service]: true });

      setTimeout(() => { // Simulate API call
        const newSettings = { ...currentSettings };
        const serviceSettings = newSettings.integrations[service];
        
        serviceSettings.connected = !serviceSettings.connected;
        if (serviceSettings.connected) {
            serviceSettings.account = user?.email;
            serviceSettings.property = projects.find(p => p.id === selectedProjectId)?.domain;
        } else {
            delete serviceSettings.account;
            delete serviceSettings.property;
        }

        updateProjectSettings(newSettings);
        showNotification({ message: `${service === 'googleSearchConsole' ? 'Google Search Console' : 'Google Analytics'} ${serviceSettings.connected ? 'conectado' : 'desconectado'} com sucesso!`, type: 'success' });
        setLoading({ ...loading, [service]: false });

      }, 1500);
  };

  if (projects.length === 0) {
     return (
        <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">Configurações</h2>
            <p className="text-gray-500 mt-2">Nenhum projeto encontrado. Por favor, crie um projeto primeiro.</p>
        </div>
    );
  }

  if (!selectedProjectId || !currentSettings) {
    return (
        <div className="text-center p-10">
            <SpinnerIcon className="animate-spin h-8 w-8 text-ninja-blue mx-auto" />
            <p className="mt-4 text-gray-500">Carregando configurações do projeto...</p>
        </div>
    );
  }
  
  const IntegrationRow: React.FC<{
      service: 'googleSearchConsole' | 'googleAnalytics';
      name: string;
      icon: React.ReactNode;
  }> = ({ service, name, icon }) => {
    const settings = currentSettings.integrations[service];
    const isConnecting = loading[service];
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
                <div className="mr-4">{icon}</div>
                <div>
                    <h4 className="font-semibold text-gray-800">{name}</h4>
                    {settings.connected && settings.property && (
                        <p className="text-sm text-gray-500">{settings.property}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center">
                {settings.connected && (
                     <span className="text-xs font-medium mr-4 px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                        Conectado
                    </span>
                )}
                <button
                    onClick={() => handleIntegrationToggle(service)}
                    disabled={isConnecting}
                    className={`font-semibold py-2 px-4 rounded-md text-sm flex items-center justify-center w-32 ${
                        settings.connected 
                        ? 'bg-white text-red-600 border border-red-300 hover:bg-red-50' 
                        : 'bg-ninja-blue text-white hover:bg-indigo-700'
                    } disabled:bg-gray-300 disabled:cursor-wait`}
                >
                    {isConnecting ? <SpinnerIcon className="animate-spin h-5 w-5" /> : (settings.connected ? 'Desconectar' : 'Conectar')}
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="project-select" className="block text-sm font-medium text-gray-700">
          Configurações para o projeto
        </label>
        <select
          id="project-select"
          value={selectedProjectId}
          onChange={handleProjectChange}
          className="mt-1 block w-full max-w-sm pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ninja-blue focus:border-ninja-blue sm:text-sm rounded-md shadow-sm"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('integrations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'integrations' ? 'border-ninja-blue text-ninja-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Integrações</button>
              <button onClick={() => setActiveTab('wordpress')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'wordpress' ? 'border-ninja-blue text-ninja-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>WordPress</button>
              <button onClick={() => setActiveTab('authors')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'authors' ? 'border-ninja-blue text-ninja-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Autores</button>
          </nav>
      </div>

      {activeTab === 'integrations' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conectar Serviços</h3>
            <div className="space-y-4">
                <IntegrationRow service="googleSearchConsole" name="Google Search Console" icon={<GoogleSearchConsoleIcon className="w-8 h-8"/>} />
                <IntegrationRow service="googleAnalytics" name="Google Analytics" icon={<GoogleAnalyticsIcon className="w-8 h-8"/>} />
            </div>
        </div>
      )}

      {activeTab === 'wordpress' && (
         <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Configurações do WordPress</h3>
            <p className="text-sm text-gray-500 mb-4">Conecte seu site para publicação automática de conteúdo.</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">URL do Site WordPress</label>
                    <input type="text" value={currentSettings.wordpress.url} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Usuário (Admin)</label>
                    <input type="text" value={currentSettings.wordpress.username} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Senha de Aplicativo</label>
                    <input type="password" placeholder="********" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    <a href="#" className="text-xs text-ninja-blue hover:underline mt-1">Como gerar uma senha de aplicativo?</a>
                </div>
                <div className="flex justify-between items-center pt-2">
                    <p className="text-sm text-gray-500">
                        Status: <span className="font-semibold">{currentSettings.wordpress.lastSync ? `Sincronizado em ${currentSettings.wordpress.lastSync}` : 'Não sincronizado'}</span>
                    </p>
                    <button className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Salvar e Sincronizar</button>
                </div>
            </div>
         </div>
      )}

       {activeTab === 'authors' && (
         <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Gerenciar Autores</h3>
                    <p className="text-sm text-gray-500">Adicione autores que serão usados nos posts do WordPress.</p>
                </div>
                <button className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Autor
                </button>
            </div>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSettings.authors.map(author => (
                             <tr key={author.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{author.name}</td>
                                <td className="px-6 py-4">{author.email}</td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center space-x-1">
                                        <button title="Editar" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                        <button title="Excluir" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                 {currentSettings.authors.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum autor cadastrado.</p>}
            </div>
         </div>
      )}
    </div>
  );
};

export default Settings;