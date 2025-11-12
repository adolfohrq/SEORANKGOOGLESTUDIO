import React, { useState, useContext } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PlusIcon, EditIcon, BrainIcon, ArrowLeftIcon, SpinnerIcon, AlertTriangleIcon, TrashIcon } from '../Icons';
import { ContentPlan, ContentPlanResult, Page } from '../../types';
import { AppContext } from '../../context/AppContext';
import Modal from '../Modal';

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


const ContentPlanning: React.FC = () => {
    const { route, navigate, contentPlans, addContentPlan, deleteContentPlan, projects } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedResults, setGeneratedResults] = useState<ContentPlanResult[]>([]);
    const [planToDelete, setPlanToDelete] = useState<ContentPlan | null>(null);

    const [formState, setFormState] = useState({
        projectName: projects.length > 0 ? projects[0].name : '',
        planName: 'Planejamento Inteligente - ' + new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
        objectives: 'Aumentar autoridade no nicho de marketing digital, gerar leads qualificados, educar o público sobre SEO.',
        niche: 'Marketing Digital',
        audience: 'Empreendedores digitais',
        authorSpecialty: 'SEO e Inbound Marketing',
        instructions: 'Focar em conteúdos práticos e acionáveis, evitar termos muito técnicos.',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleGeneratePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setGeneratedResults([]);

        try {
            if (!process.env.API_KEY) {
              throw new Error("API_KEY environment variable not set.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const schema = {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: 'Título atraente e otimizado para SEO para a peça de conteúdo.' },
                    description: { type: Type.STRING, description: 'Um breve resumo do que o conteúdo abordará.' },
                    keywords: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Uma lista de 3 a 5 palavras-chave primárias para este tópico.'
                    }
                  },
                  required: ["title", "description", "keywords"],
                }
              };
              
            const prompt = `Você é um estrategista de conteúdo SEO especialista. Baseado nas seguintes informações, gere uma lista de 5 ideias de conteúdo. Para cada ideia, forneça um título atraente, uma breve descrição e uma lista de 3 a 5 palavras-chave primárias.
            - **Projeto**: ${formState.projectName}
            - **Objetivos**: ${formState.objectives}
            - **Nicho**: ${formState.niche}
            - **Público-alvo**: ${formState.audience}
            - **Especialidade do Autor**: ${formState.authorSpecialty}
            - **Instruções Adicionais**: ${formState.instructions}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });
            
            let jsonText = response.text.trim();
            const parsedResults = JSON.parse(jsonText);
            setGeneratedResults(parsedResults);
            navigate({ page: Page.ContentPlanning, view: 'results' });

        } catch (e: any) {
            console.error(e);
            setError(`Ocorreu um erro ao gerar o planejamento. Por favor, verifique sua chave de API e tente novamente. Detalhes: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePlan = () => {
        const newPlan: Omit<ContentPlan, 'id' | 'userId'> = {
            name: formState.planName,
            type: 'Inteligente',
            status: 'Concluído',
            project: formState.projectName,
            createdAt: new Date().toLocaleDateString('pt-BR'),
            results: generatedResults,
        };
        addContentPlan(newPlan);
    }

    if (route.view === 'selectType') {
        return (
            <div>
                 <button onClick={() => navigate({ page: Page.ContentPlanning, view: 'list' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Voltar para Planejamentos
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Escolha o Tipo de Planejamento</h2>
                    <p className="text-gray-500 mt-1">Selecione como deseja planejar seu conteúdo.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-lg shadow-sm border text-center flex flex-col">
                        <div className="mx-auto bg-blue-100 p-3 rounded-full mb-4"><EditIcon className="w-8 h-8 text-ninja-blue" /></div>
                        <h3 className="text-xl font-semibold mb-2">Planejamento Manual</h3>
                        <p className="text-gray-600 flex-grow">Você define manualmente os títulos ou palavras-chave que deseja transformar em conteúdo.</p>
                        <button className="mt-6 bg-ninja-blue text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 transition-colors">Criar Planejamento Manual</button>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm border text-center flex flex-col">
                        <div className="mx-auto bg-purple-100 p-3 rounded-full mb-4"><BrainIcon className="w-8 h-8 text-purple-600" /></div>
                        <h3 className="text-xl font-semibold mb-2">Planejamento Inteligente</h3>
                        <p className="text-gray-600 flex-grow">Nossa IA analisa seu nicho e gera automaticamente as melhores palavras-chave para seus conteúdos.</p>
                        <button onClick={() => navigate({ page: Page.ContentPlanning, view: 'intelligentForm' })} className="mt-6 bg-purple-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-purple-700 transition-colors">Criar Planejamento Inteligente</button>
                    </div>
                </div>
            </div>
        )
    }

    if (route.view === 'intelligentForm' || route.view === 'results') {
         return (
            <div>
                 <button onClick={() => navigate({ page: Page.ContentPlanning, view: route.view === 'results' ? 'intelligentForm' : 'selectType' })} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Voltar
                </button>
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">Novo Planejamento Inteligente</h2>
                    <p className="text-gray-500 mb-6">A IA analisará seu nicho e gerará palavras-chave otimizadas.</p>
                    <form onSubmit={handleGeneratePlan} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Projeto *</label>
                                <select id="projectName" name="projectName" value={formState.projectName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    {projects.map(p => <option key={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="planName" className="block text-sm font-medium text-gray-700">Nome do Planejamento *</label>
                                <input type="text" id="planName" name="planName" value={formState.planName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">Informações para a IA</label>
                            <textarea id="objectives" name="objectives" rows={3} value={formState.objectives} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Descreva o que você deseja alcançar com este conteúdo..."></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="niche" className="block text-sm font-medium text-gray-700">Nicho *</label>
                                <input type="text" id="niche" name="niche" value={formState.niche} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-gray-700">Público-Alvo *</label>
                                <input type="text" id="audience" name="audience" value={formState.audience} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="authorSpecialty" className="block text-sm font-medium text-gray-700">Especialidade do Autor</label>
                                <input type="text" id="authorSpecialty" name="authorSpecialty" value={formState.authorSpecialty} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instruções Personalizadas</label>
                            <textarea id="instructions" name="instructions" rows={3} value={formState.instructions} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Instruções adicionais para a IA..."></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="bg-purple-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-purple-700 transition-colors flex items-center disabled:bg-purple-300 disabled:cursor-not-allowed">
                                {loading && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                                {loading ? 'Gerando...' : (route.view === 'results' ? 'Gerar Novamente' : 'Gerar Planejamento com IA')}
                            </button>
                        </div>
                    </form>
                    
                    {error && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0"><AlertTriangleIcon className="h-5 w-5 text-red-400" /></div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {generatedResults.length > 0 && (
                        <div className="mt-8 pt-6 border-t">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Resultados do Planejamento Inteligente</h3>
                                <button onClick={handleSavePlan} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700">
                                  Salvar Planejamento
                                </button>
                            </div>
                            <div className="space-y-4">
                                {generatedResults.map((result, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                                        <h4 className="font-semibold text-ninja-blue">{result.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {result.keywords.map((kw, kwIndex) => (
                                                <span key={kwIndex} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
         );
    }


    return (
        <div className="space-y-6">
            {planToDelete && (
              <Modal
                title="Excluir Planejamento"
                message={`Você tem certeza que deseja excluir o planejamento "${planToDelete.name}"?`}
                onConfirm={() => {
                  deleteContentPlan(planToDelete.id);
                  setPlanToDelete(null);
                }}
                onCancel={() => setPlanToDelete(null)}
              />
            )}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Planejamentos de Conteúdo</h2>
                    <p className="text-sm text-gray-500">Gerencie seus planejamentos manuais ou inteligentes</p>
                </div>
                <button onClick={() => navigate({ page: Page.ContentPlanning, view: 'selectType' })} className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Planejamento
                </button>
            </div>
            <div className="flex flex-wrap gap-4">
                <StatCard label="Total" value={contentPlans.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} color="bg-gray-100" />
                <StatCard label="Rascunho" value={contentPlans.filter(p => p.status === 'Rascunho').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} color="bg-blue-100" />
                <StatCard label="Processando" value={contentPlans.filter(p => p.status === 'Processando').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8h.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12a8 8 0 01-8 8h-.5" /></svg>} color="bg-yellow-100" />
                <StatCard label="Concluídos" value={contentPlans.filter(p => p.status === 'Concluído').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-100" />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome do Planejamento</th>
                            <th scope="col" className="px-6 py-3">Projeto</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Criado em</th>
                            <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contentPlans.map(plan => (
                             <tr key={plan.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
                                <td className="px-6 py-4">{plan.project}</td>
                                <td className="px-6 py-4">{plan.type}</td>
                                <td className="px-6 py-4">
                                     <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${plan.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {plan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{plan.createdAt}</td>
                                <td className="px-6 py-4">
                                     <button onClick={() => setPlanToDelete(plan)} title="Excluir" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600">
                                        <TrashIcon className="w-4 h-4" />
                                     </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {contentPlans.length === 0 && (
                    <div className="text-center p-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Nenhum planejamento ainda</h3>
                        <p className="text-gray-500 mt-1 mb-4">Crie seu primeiro planejamento de conteúdo</p>
                        <button onClick={() => navigate({ page: Page.ContentPlanning, view: 'selectType' })} className="bg-ninja-blue text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 transition-colors">
                            + Criar Primeiro Planejamento
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ContentPlanning;