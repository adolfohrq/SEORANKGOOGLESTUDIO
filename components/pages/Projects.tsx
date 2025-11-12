import React, { useContext, useState, useEffect } from 'react';
import { Project, Page } from '../../types';
import { AppContext } from '../../context/AppContext';
import Modal from '../Modal';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon } from '../Icons';

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex-1">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const ProjectForm: React.FC<{ project?: Project; onSave: (project: any) => void; onCancel: () => void; }> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    domain: project?.domain || '',
    status: project?.status || 'Ativo',
    wordpressStatus: project?.wordpressStatus || 'Não Sincronizado',
    autoMode: project?.autoMode || false,
    frequency: project?.frequency || '1/dia',
    createdAt: project?.createdAt || new Date().toLocaleDateString('pt-BR'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (project) {
        onSave({ ...project, ...formData });
    } else {
        onSave(formData);
    }
  };

  return (
    <div>
       <button onClick={onCancel} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Voltar para Projetos
      </button>
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">{project ? 'Editar Projeto' : 'Novo Projeto'}</h2>
        <p className="text-gray-500 mb-6">Configure seu projeto de forma detalhada e organizada.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Projeto *</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domínio Principal *</label>
                <input type="text" name="domain" id="domain" value={formData.domain} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="dominio.com.br" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status do Projeto</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option>Ativo</option>
                        <option>Pausado</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequência de Publicação</label>
                    <select name="frequency" id="frequency" value={formData.frequency} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option>1/dia</option>
                        <option>3/dia</option>
                        <option>1/semana</option>
                    </select>
                </div>
            </div>
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="autoMode" name="autoMode" type="checkbox" checked={formData.autoMode} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="autoMode" className="font-medium text-gray-700">Modo Automático</label>
                    <p className="text-gray-500">Publicação automática de conteúdos (Requer WordPress Sincronizado)</p>
                </div>
            </div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Salvar Projeto</button>
            </div>
        </form>
      </div>
    </div>
  );
};


const Projects: React.FC = () => {
  const { route, navigate, projects, addProject, updateProject, deleteProject } = useContext(AppContext);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  if (route.page === Page.Projects && route.view === 'new') {
    return <ProjectForm onSave={addProject} onCancel={() => navigate({ page: Page.Projects, view: 'list' })} />;
  }
  
  if (route.page === Page.Projects && route.view === 'edit') {
    const project = projects.find(p => p.id === route.id);
    return project ? <ProjectForm project={project} onSave={updateProject} onCancel={() => navigate({ page: Page.Projects, view: 'list' })} /> : <div>Projeto não encontrado</div>;
  }

  return (
    <div className="space-y-6">
       {projectToDelete && (
        <Modal
          title={`Excluir Projeto`}
          message={`Você tem certeza que deseja excluir o projeto "${projectToDelete.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => {
            deleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Projetos</h2>
          <p className="text-sm text-gray-500">Gerencie seus projetos de conteúdo SEO</p>
        </div>
        <button onClick={() => navigate({ page: Page.Projects, view: 'new' })} className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Projeto
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard label="Total" value={projects.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>} color="bg-gray-100" />
        <StatCard label="Ativos" value={projects.filter(p => p.status === 'Ativo').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>} color="bg-green-100" />
        <StatCard label="Pausados" value={projects.filter(p => p.status === 'Pausado').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-yellow-100" />
        <StatCard label="Concluídos" value={0} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>} color="bg-red-100" />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Projeto</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Wordpress</th>
              <th scope="col" className="px-6 py-3">Modo Auto</th>
              <th scope="col" className="px-6 py-3">Frequência</th>
              <th scope="col" className="px-6 py-3">Criado em</th>
              <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id} className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {project.name}
                </th>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${project.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${project.wordpressStatus === 'Sincronizado' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {project.wordpressStatus}
                  </span>
                </td>
                <td className="px-6 py-4">{project.autoMode ? 'Sim' : 'Não'}</td>
                <td className="px-6 py-4">{project.frequency}</td>
                <td className="px-6 py-4">{project.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <button onClick={() => navigate({ page: Page.Projects, view: 'edit', id: project.id })} title="Editar" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600">
                       <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setProjectToDelete(project)} title="Excluir" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600">
                       <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
            <div className="text-center p-8">
                <h3 className="text-lg font-semibold text-gray-800">Nenhum projeto encontrado</h3>
                <p className="text-gray-500 mt-1 mb-4">Comece criando seu primeiro projeto de SEO.</p>
                <button onClick={() => navigate({ page: Page.Projects, view: 'new' })} className="bg-ninja-blue text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 transition-colors">
                    + Criar Primeiro Projeto
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Projects;