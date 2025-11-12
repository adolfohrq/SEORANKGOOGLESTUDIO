
import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Project, SEOAuditResult } from '../../types';
import { SpinnerIcon, ArrowLeftIcon, CheckCircleIcon, LinkIcon, ImageIcon, ClockIcon } from '../Icons';

const AuditResults: React.FC<{ result: SEOAuditResult, projectName: string, onBack: () => void }> = ({ result, projectName, onBack }) => (
  <div>
    <button onClick={onBack} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Voltar para Auditoria
    </button>
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-800">Resultados da Auditoria para "{projectName}"</h2>
      <div className="flex items-center justify-center my-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold ${result.score > 80 ? 'bg-green-500' : result.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
          {result.score}
          <span className="text-lg mt-2">/100</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 p-4 rounded-md">
            <CheckCircleIcon className="w-8 h-8 mx-auto text-green-500 mb-2"/>
            <p className="text-2xl font-bold">{result.score}/100</p>
            <p className="text-sm text-gray-500">SEO Score</p>
        </div>
         <div className="bg-gray-50 p-4 rounded-md">
            <LinkIcon className="w-8 h-8 mx-auto text-red-500 mb-2"/>
            <p className="text-2xl font-bold">{result.brokenLinks}</p>
            <p className="text-sm text-gray-500">Links Quebrados</p>
        </div>
         <div className="bg-gray-50 p-4 rounded-md">
            <ImageIcon className="w-8 h-8 mx-auto text-yellow-500 mb-2"/>
            <p className="text-2xl font-bold">{result.missingAlts}</p>
            <p className="text-sm text-gray-500">Imagens sem Alt</p>
        </div>
         <div className="bg-gray-50 p-4 rounded-md">
            <ClockIcon className="w-8 h-8 mx-auto text-blue-500 mb-2"/>
            <p className="text-2xl font-bold">{result.slowPages}</p>
            <p className="text-sm text-gray-500">Páginas Lentas</p>
        </div>
      </div>
    </div>
  </div>
);

const SeoAudits: React.FC = () => {
  const { projects } = useContext(AppContext);
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects.length > 0 ? projects[0] : null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SEOAuditResult | null>(null);

  const handleAudit = () => {
    if (!selectedProject) return;
    setLoading(true);
    setResult(null);
    // Simulate API call for audit
    setTimeout(() => {
      setResult({
        score: Math.floor(Math.random() * 50) + 50, // Score between 50 and 100
        brokenLinks: Math.floor(Math.random() * 10),
        missingAlts: Math.floor(Math.random() * 30),
        slowPages: Math.floor(Math.random() * 5),
      });
      setLoading(false);
    }, 3000);
  };

  if (result && selectedProject) {
    return <AuditResults result={result} projectName={selectedProject.name} onBack={() => setResult(null)} />;
  }
  
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold text-gray-800">Auditorias de SEO Técnico</h2>
      <p className="text-sm text-gray-500 mt-1">Selecione um projeto para analisar suas páginas indexadas</p>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label htmlFor="project" className="block text-sm font-medium text-gray-700">Projeto</label>
          <select 
            id="project" 
            name="project" 
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value) || null)}
            value={selectedProject?.id || ''}
            disabled={loading}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">Páginas indexadas</span>
          <span className="text-sm font-bold text-gray-800">-</span>
        </div>

        <button 
          onClick={handleAudit} 
          disabled={!selectedProject || loading} 
          className="mt-6 w-full bg-ninja-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Analisando...
            </>
          ) : (
            <>
              Analisar Páginas
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SeoAudits;
