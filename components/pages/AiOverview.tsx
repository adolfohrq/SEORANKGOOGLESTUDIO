import React, { useState, useContext } from 'react';
import { Page, AIQuery } from '../../types';
import { ChevronRightIcon, HistoryIcon, PlusIcon, ArrowLeftIcon, CheckCircleIcon, TrendingUpIcon, UsersIcon, MessageCircleIcon, EditIcon, TrashIcon } from '../Icons';
import { AppContext } from '../../context/AppContext';
import Modal from '../Modal';

const AIQueryForm: React.FC<{ query?: AIQuery; onSave: (query: any) => void; onCancel: () => void; }> = ({ query, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        keyword: query?.keyword || '',
        question: query?.question || '',
        frequency: query?.frequency || 'Semanalmente',
        status: query?.status || 'Ativo',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            onSave({ ...query, ...formData });
        } else {
            onSave(formData);
        }
    };

    return (
        <div>
            <button onClick={onCancel} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Voltar
            </button>
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800">{query ? 'Editar' : 'Nova'} Query</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium">Palavra-chave / Tema</label>
                        <input type="text" name="keyword" value={formData.keyword} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Pergunta Humanizada</label>
                        <input type="text" name="question" value={formData.question} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Frequência de Verificação</label>
                        <select name="frequency" value={formData.frequency} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option>Diariamente</option>
                            <option>Semanalmente</option>
                            <option>Mensalmente</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 py-2 px-4 rounded-md">Cancelar</button>
                        <button type="submit" className="bg-ninja-blue text-white py-2 px-4 rounded-md">Salvar Query</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const ManageQueries: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { aiQueries, addAIQuery, updateAIQuery, deleteAIQuery, navigate, route } = useContext(AppContext);
    const [queryToDelete, setQueryToDelete] = useState<AIQuery | null>(null);

    if (route.page === Page.AiOverview && route.view === 'new') {
        return <AIQueryForm onSave={addAIQuery} onCancel={onBack} />;
    }

    if (route.page === Page.AiOverview && route.view === 'edit' && route.id) {
        const query = aiQueries.find(q => q.id === route.id);
        return query ? <AIQueryForm query={query} onSave={updateAIQuery} onCancel={onBack} /> : <div>Query não encontrada.</div>;
    }

    return (
        <div className="space-y-6">
            {queryToDelete && <Modal title="Excluir Query" message={`Deseja excluir a query "${queryToDelete.keyword}"?`} onConfirm={() => { deleteAIQuery(queryToDelete.id); setQueryToDelete(null); }} onCancel={() => setQueryToDelete(null)} />}
            <div className="flex justify-between items-center">
                <div>
                    <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Voltar ao Dashboard
                    </button>
                    <h2 className="text-xl font-semibold text-gray-800">Gerenciar Queries</h2>
                </div>
                <button onClick={() => navigate({ page: Page.AiOverview, view: 'new' })} className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md flex items-center">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Nova Query
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
                 <table className="w-full text-sm">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Palavra-chave</th>
                            <th className="px-6 py-3 text-left">Frequência</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aiQueries.map(q => (
                            <tr key={q.id} className="border-b">
                                <td className="px-6 py-4 font-medium">{q.keyword}</td>
                                <td className="px-6 py-4">{q.frequency}</td>
                                <td className="px-6 py-4">
                                     <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${q.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {q.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-1">
                                        <button onClick={() => navigate({ page: Page.AiOverview, view: 'edit', id: q.id })} className="p-2 hover:bg-gray-100 rounded-full"><EditIcon className="w-4 h-4" /></button>
                                        <button onClick={() => setQueryToDelete(q)} className="p-2 hover:bg-gray-100 rounded-full"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                 {aiQueries.length === 0 && <p className="text-center text-gray-500 py-8">Nenhuma query configurada.</p>}
            </div>
        </div>
    )
}

const AiOverviewDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { navigate, aiQueries } = useContext(AppContext);
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                     <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Trocar Projeto
                    </button>
                    <div className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-md inline-block">
                        Projeto: Meu Primeiro Projeto
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-50 flex items-center">
                        <HistoryIcon className="w-5 h-5 mr-2" />
                        Histórico
                    </button>
                    <button onClick={() => navigate({ page: Page.AiOverview, view: 'queries' })} className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
                        Gerenciar Queries
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-blue-500 text-white p-5 rounded-lg shadow-lg">
                    <div className="flex items-center"><CheckCircleIcon className="w-6 h-6 mr-2"/> <h3 className="font-semibold">Taxa de Citação</h3></div>
                    <p className="text-3xl font-bold mt-2">8%</p>
                    <p className="text-sm opacity-80">últimos 30 dias</p>
                    <p className="text-xs mt-1 opacity-80">0 de 0 execuções</p>
                </div>
                 <div className="bg-green-500 text-white p-5 rounded-lg shadow-lg">
                    <div className="flex items-center"><TrendingUpIcon className="w-6 h-6 mr-2"/> <h3 className="font-semibold">Posição Média</h3></div>
                    <p className="text-3xl font-bold mt-2">1ª posição</p>
                    <p className="text-sm opacity-80">Quando você é citado</p>
                </div>
                 <div className="bg-orange-500 text-white p-5 rounded-lg shadow-lg">
                    <div className="flex items-center"><UsersIcon className="w-6 h-6 mr-2"/> <h3 className="font-semibold">Competidores</h3></div>
                    <p className="text-3xl font-bold mt-2">0</p>
                    <p className="text-sm opacity-80">identificados</p>
                    <a href="#" className="text-xs mt-1 opacity-90 hover:opacity-100 underline">Ver análise completa...</a>
                </div>
                <div className="bg-purple-500 text-white p-5 rounded-lg shadow-lg">
                     <div className="flex items-center"><MessageCircleIcon className="w-6 h-6 mr-2"/> <h3 className="font-semibold">Sentimento</h3></div>
                     <div className="flex items-center space-x-3 mt-2">
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-3xl font-bold">0</p>
                     </div>
                     <p className="text-sm opacity-80">Análise de sentimento nas citações</p>
                </div>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-4">Evolução da Taxa de Citação</h3>
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                        <p className="text-gray-500">Gráfico em desenvolvimento</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                     <h3 className="font-semibold text-gray-800 mb-4">Queries Ativas</h3>
                     {aiQueries.length > 0 ? (
                        <ul className="space-y-2">
                            {aiQueries.map(q => <li key={q.id} className="text-sm text-gray-600">{q.keyword}</li>)}
                        </ul>
                     ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-sm">Nenhuma query configurada</p>
                            <button onClick={() => navigate({ page: Page.AiOverview, view: 'queries' })} className="mt-4 w-full bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">
                                + Criar Query
                            </button>
                        </div>
                     )}
                </div>
            </div>

        </div>
    );
};

const AiOverview: React.FC = () => {
    const { route, navigate, projects, aiQueries } = useContext(AppContext);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    if (route.page === Page.AiOverview && (route.view === 'queries' || route.view === 'new' || route.view === 'edit')) {
        return <ManageQueries onBack={() => navigate({ page: Page.AiOverview, view: 'list'})} />;
    }

    if (selectedProject) {
        return <AiOverviewDashboard onBack={() => setSelectedProject(null)} />;
    }

    return (
        <div className="space-y-6 flex flex-col items-center">
            <div className="text-center">
                <span className="text-4xl">🤖</span>
                <h2 className="text-xl font-semibold text-gray-800 mt-2">AI Overview Monitoring</h2>
                <p className="text-sm text-gray-500 mt-1">Selecione um projeto para começar a monitorar como as IAs citam seu negócio</p>
            </div>
            
            {projects.map(project => (
                 <div key={project.id} onClick={() => setSelectedProject(project.id)} className="w-full max-w-md bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md mr-4">
                            <span className="text-xl font-bold text-gray-600">{project.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{project.name}</h3>
                            <p className="text-sm text-gray-500">
                                <span className="font-bold text-gray-700">{aiQueries.length}</span> Queries Ativas
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="font-bold text-gray-700">0</span> Execuções
                            </p>
                        </div>
                    </div>
                    <ChevronRightIcon className="text-gray-400" />
                </div>
            ))}

            {projects.length === 0 && (
                 <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-sm border">
                    <p className="text-gray-600">Nenhum projeto encontrado. Por favor, crie um projeto primeiro.</p>
                     <button onClick={() => navigate({ page: Page.Projects, view: 'list'})} className="mt-4 bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md">
                        Ir para Projetos
                     </button>
                 </div>
            )}
           
        </div>
    );
};

export default AiOverview;