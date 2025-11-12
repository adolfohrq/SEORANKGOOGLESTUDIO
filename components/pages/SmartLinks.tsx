import React, { useContext, useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, ArrowLeftIcon } from '../Icons';
import { SmartLink, Page } from '../../types';
import { AppContext } from '../../context/AppContext';
import Modal from '../Modal';

const StatCard: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 text-center">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const SmartLinkForm: React.FC<{ link?: SmartLink, onSave: (link: any) => void, onCancel: () => void }> = ({ link, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: link?.name || '',
        type: link?.type || 'URL Externa',
        status: link?.status || 'Ativo',
        // In a real app, shortLink and clicks would be handled by the backend
        shortLink: link?.shortLink || `ninjarank.com/${Math.random().toString(36).substring(7)}`,
        clicks: link?.clicks || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
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
                <h2 className="text-2xl font-semibold text-gray-800">{link ? 'Editar' : 'Novo'} Link Inteligente</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium">Nome do Link</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Tipo de Link</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option>URL Externa</option>
                            <option>Whatsapp</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                            <option>Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 py-2 px-4 rounded-md">Cancelar</button>
                        <button type="submit" className="bg-ninja-blue text-white py-2 px-4 rounded-md">Salvar Link</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const SmartLinks: React.FC = () => {
    const { route, navigate, smartLinks, addSmartLink, updateSmartLink, deleteSmartLink } = useContext(AppContext);
    const [linkToDelete, setLinkToDelete] = useState<SmartLink | null>(null);

    if (route.page === Page.SmartLinks && route.view === 'new') {
        return <SmartLinkForm onSave={addSmartLink} onCancel={() => navigate({ page: Page.SmartLinks, view: 'list' })} />;
    }
    
    if (route.page === Page.SmartLinks && route.view === 'edit') {
        const link = smartLinks.find(l => l.id === route.id);
        return link ? <SmartLinkForm link={link} onSave={updateSmartLink} onCancel={() => navigate({ page: Page.SmartLinks, view: 'list' })} /> : <div>Link não encontrado</div>;
    }

    const totalClicks = smartLinks.reduce((sum, l) => sum + l.clicks, 0);

    return (
        <div className="space-y-6">
            {linkToDelete && (
                 <Modal
                    title="Excluir Link"
                    message={`Você tem certeza que deseja excluir o link "${linkToDelete.name}"?`}
                    onConfirm={() => {
                        deleteSmartLink(linkToDelete.id);
                        setLinkToDelete(null);
                    }}
                    onCancel={() => setLinkToDelete(null)}
                />
            )}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Links Inteligentes</h2>
                    <p className="text-sm text-gray-500">Crie e gerencie links curtos com rastreamento</p>
                </div>
                <button onClick={() => navigate({ page: Page.SmartLinks, view: 'new' })} className="bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Novo Link
                </button>
            </div>

            <div className="flex flex-wrap gap-4">
                <StatCard label="TOTAL DE LINKS" value={smartLinks.length} colorClass="text-gray-800" />
                <StatCard label="ATIVOS" value={smartLinks.filter(l => l.status === 'Ativo').length} colorClass="text-green-500" />
                <StatCard label="INATIVOS" value={smartLinks.filter(l => l.status === 'Inativo').length} colorClass="text-red-500" />
                <StatCard label="TOTAL DE CLIQUES" value={totalClicks} colorClass="text-blue-500" />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">NOME</th>
                            <th scope="col" className="px-6 py-3">TIPO</th>
                            <th scope="col" className="px-6 py-3">LINK CURTO</th>
                            <th scope="col" className="px-6 py-3">CLIQUES</th>
                            <th scope="col" className="px-6 py-3">STATUS</th>
                            <th scope="col" className="px-6 py-3">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {smartLinks.map(link => (
                            <tr key={link.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{link.name}</td>
                                <td className="px-6 py-4">{link.type}</td>
                                <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">{link.shortLink}</td>
                                <td className="px-6 py-4 font-semibold">{link.clicks}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${link.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {link.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center space-x-1">
                                        <button onClick={() => navigate({ page: Page.SmartLinks, view: 'edit', id: link.id })} title="Editar" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600">
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
                 {smartLinks.length === 0 && (
                    <div className="text-center py-12 px-6">
                        <p className="text-gray-500">Nenhum link encontrado. Crie seu primeiro link!</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default SmartLinks;