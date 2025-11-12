
import React from 'react';

const EmptyState: React.FC<{ title: string; description: string; buttonText: string }> = ({ title, description, buttonText }) => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-10">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-1 mb-4">{description}</p>
      <button className="bg-ninja-blue text-white font-semibold py-2 px-5 rounded-md hover:bg-indigo-700 transition-colors">
        {buttonText}
      </button>
    </div>
);

const Reports: React.FC = () => <EmptyState title="Nenhum projeto conectado" description="Conecte seus projetos ao Google Search Console para visualizar relatórios estratégicos." buttonText="Ir para Projetos" />;

export default Reports;
