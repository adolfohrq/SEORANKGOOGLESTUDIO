import React, { useContext, useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, ArrowLeftIcon } from '../Icons';
import { InternalLink, Page } from '../../types';
import { AppContext } from '../../context/AppContext';
import Modal from '../Modal';

const StatCard: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 text-center">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const InternalLinkForm: React.FC<{ link?: InternalLink; onSave: (link: any) => void; onCancel: () => void; }> = ({ link, onSave, onCancel }) => {
    const { projects } = useContext(AppContext);
    const [formData, setFormData] = useState({
        keyword: link?.keyword || '',
        destinationUrl: link?.destinationUrl || '',
        project: link?.project || (projects.length > 0 ? projects[0].name : ''),
        priority: link?.priority || 'Baixa',
        isPillar: link?.isPillar || false,
        status: link?.status || 'Ativo'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({...prev, [name]: checked}));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (link) {
            onSave({ ...link, ...formData });
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
                <h2 className="text-2xl font-semibold text-gray-800">{link ? 'Editar' : 'Nova'} Palavra-chave de Link Interno</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Projeto</label>
                        <select name="project" value={formData.project} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            {projects.map(p => <option key={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Palavras-chave (separe com vírgula)</label>
                        <input type="text" name="keyword" value={formData.keyword} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de Destino</label>
                        <input type="url" name="destinationUrl" value={formData.destinationUrl} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                             <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option>Baixa</option>
                                <option>Média</option>
                                <option>Alta</option>
                            </select>
                        </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700">Status</label>
                             <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                <option>Ativo</option>
                                <option>Inativo</option>
                            </select>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" name="isPillar" checked={formData.isPillar} onChange={handleChange} className="h-4 w-4 text-ninja-blue border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Marcar como Conteúdo Pilar</label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                        <button type="submit" className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700">Salvar Palavra-chave</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const InternalLinks: React.FC = () => {
    const { route, navigate, internalLinks, addInternalLink, updateInternalLink, deleteInternalLink } = useContext(AppContext);
    const [linkToDelete, setLinkToDelete] = useState<InternalLink | null>(null);

    if (route.page === Page.InternalLinks && route.view === 'new') {
        return <InternalLinkForm onSave={addInternalLink} onCancel={() => navigate({ page: Page.InternalLinks, view: 'list' })} />;
    }
    
    if (route.page === Page.InternalLinks && route.view === 'edit') {
        const link = internalLinks.find(l => l.id === route.id);
        return link ? <InternalLinkForm link={link} onSave={updateInternalLink} onCancel={() => navigate({ page: Page.InternalLinks, view: 'list' })} /> : <div>Link não encontrado</div>;
    }

    return (
        <div className="space-y-6">
            {linkToDelete && (
                 <Modal
                    title="Excluir Palavra-chave"
                    message={`Você tem certeza que deseja excluir a palavra-chave "${linkToDelete.keyword}"?`}
                    onConfirm={() => {
                        deleteInternalLink(linkToDelete.id);
                        setLinkToDelete(null);
                    }}
                    onCancel={() => setLinkToDelete(null)}
                />
            )}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Links Internos</h2>
                    <p className="text-sm text-gray-500">Configure palavras-chave para criar links internos automaticamente nos seus conteúdos</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-50">
                        Ver Relatório
                    </button>
                    <button onClick={() => navigate({ page: Page.InternalLinks, view: 'new' })} className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-1" />
                        Nova Palavra-chave
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <StatCard label="TOTAL DE PALAVRAS" value={internalLinks.length} colorClass="text-gray-800" />
                <StatCard label="ATIVAS" value={internalLinks.filter(l => l.status === 'Ativo').length} colorClass="text-green-500" />
                <StatCard label="INATIVAS" value={internalLinks.filter(l => l.status === 'Inativo').length} colorClass="text-red-500" />
                <StatCard label="CONTEÚDO PILAR" value={internalLinks.filter(l => l.isPillar).length} colorClass="text-blue-500" />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">PALAVRA-CHAVE</th>
                            <th scope="col" className="px-6 py-3">URL DESTINO</th>
                            <th scope="col" className="px-6 py-3">PROJETO</th>
                            <th scope="col" className="px-6 py-3">PRIORIDADE</th>
                            <th scope="col" className="px-6 py-3">PILAR</th>
                            <th scope="col" className="px-6 py-3">STATUS</th>
                            <th scope="col" className="px-6 py-3">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {internalLinks.map(link => (
                             <tr key={link.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{link.keyword}</td>
                                <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">{link.destinationUrl}</td>
                                <td className="px-6 py-4">{link.project}</td>
                                <td className="px-6 py-4">{link.priority}</td>
                                <td className="px-6 py-4">{link.isPillar ? 'Sim' : 'Não'}</td>
                                <td className="px-6 py-4">
                                     <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${link.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {link.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => navigate({ page: Page.InternalLinks, view: 'edit', id: link.id })} title="Editar" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setLinkToDelete(link)} title="Excluir" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {internalLinks.length === 0 && (
                     <div className="text-center py-12 px-6">
                        <p className="text-gray-500">Nenhuma palavra-chave configurada. Crie sua primeira palavra-chave!</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default InternalLinks;