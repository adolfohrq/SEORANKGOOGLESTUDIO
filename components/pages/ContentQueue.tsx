
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const StatCard: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex-1 text-center">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const ContentQueue: React.FC = () => {
    const { contentQueue } = useContext(AppContext);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-semibold text-gray-800">Fila de Conteúdos</h2>
                    <p className="text-sm text-gray-500">Gerencie a fila de criação de conteúdos</p>
                </div>
                {/* Filters can be added here */}
            </div>

             <div className="flex flex-wrap gap-4">
                <StatCard label="TOTAL" value={contentQueue.length} colorClass="text-gray-800" />
                <StatCard label="NA FILA" value={contentQueue.filter(i => i.status === 'Na Fila').length} colorClass="text-blue-500" />
                <StatCard label="PROCESSANDO" value={contentQueue.filter(i => i.status === 'Processando').length} colorClass="text-yellow-500" />
                <StatCard label="GERADOS" value={contentQueue.filter(i => i.status === 'Gerado').length} colorClass="text-purple-500" />
                <StatCard label="PUBLICADOS" value={contentQueue.filter(i => i.status === 'Publicado').length} colorClass="text-green-500" />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">CONTEÚDO</th>
                            <th scope="col" className="px-6 py-3">PROJETO</th>
                            <th scope="col" className="px-6 py-3">STATUS</th>
                            <th scope="col" className="px-6 py-3">DATA</th>
                            <th scope="col" className="px-6 py-3">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contentQueue.map(item => (
                            <tr key={item.id} className="bg-white border-b">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.content}</td>
                                <td className="px-6 py-4">{item.project}</td>
                                <td className="px-6 py-4">
                                     <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${
                                         item.status === 'Publicado' ? 'bg-green-100 text-green-800' :
                                         item.status === 'Gerado' ? 'bg-purple-100 text-purple-800' :
                                         item.status === 'Processando' ? 'bg-yellow-100 text-yellow-800' :
                                         'bg-blue-100 text-blue-800'
                                     }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4">
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {contentQueue.length === 0 && (
                     <div className="text-center py-12 px-6">
                        <p className="text-gray-500">Nenhum conteúdo na fila.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ContentQueue;
