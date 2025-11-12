
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
    <div className="p-3 rounded-full bg-gray-100 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { projects, contentQueue, contentPlans } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Bem-vindo, {user?.name}! 👋</h2>
      <p className="text-gray-500">Aqui está um resumo da sua conta</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Meus Projetos" value={projects.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>} />
        <StatCard label="Total Conteúdos" value={contentQueue.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        <StatCard label="Publicados" value={contentQueue.filter(c => c.status === 'Publicado').length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Planejamentos" value={contentPlans.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Vídeos Tutoriais</h3>
          <a href="#" className="text-sm font-medium text-ninja-blue hover:underline">Ver todos os cursos ></a>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm w-full md:w-1/3">
          <img src="https://picsum.photos/400/200" alt="Tutorial Thumbnail" className="rounded-md mb-4" />
          <h4 className="font-semibold text-gray-800">Tutoriais Ninja Rank</h4>
          <p className="text-sm text-gray-500">🎥 10</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start mb-4">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ninja-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Plugin WordPress</h4>
              <p className="text-sm text-gray-500">Versão 1.4.3</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Ajuste de Autores e categorias com ID Posts sem imagens</p>
          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">Baixar Plugin</button>
          <div className="text-center text-xs text-gray-400 mt-4">
            Última atualização: 22/10/2025
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Changelog - Histórico de Versões</h4>
          <ul className="space-y-4">
            <li className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-700">Versão 1.4.3</p>
                <p className="text-sm text-gray-500">28/10/2025</p>
                <p className="text-sm text-gray-600 mt-1">Ajuste de Autores e categorias com ID Posts sem imagens.</p>
              </div>
              <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">Atual</span>
            </li>
            <li className="border-t pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-700">Versão 1.4.2</p>
                  <p className="text-sm text-gray-500">25/10/2025</p>
                  <p className="text-sm text-gray-600 mt-1">Correção do Schema.org nos posts.</p>
                </div>
                <span className="text-xs font-semibold text-gray-500">Anterior</span>
              </div>
            </li>
             <li className="border-t pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-700">Versão 1.4.1</p>
                  <p className="text-sm text-gray-500">24/10/2025</p>
                  <p className="text-sm text-gray-600 mt-1">Corrigido - bug do WordPress que perdia o agendamento dos posts.</p>
                </div>
                 <span className="text-xs font-semibold text-gray-500">Anterior</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
