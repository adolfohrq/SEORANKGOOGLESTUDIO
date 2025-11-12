import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FireIcon, SpinnerIcon } from '../Icons';

const Login: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err: any) {
      // Firebase error handling
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Nenhum usuário encontrado com este e-mail.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. Por favor, tente novamente.');
          break;
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        default:
          setError('Ocorreu um erro. Por favor, tente novamente.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-ninja-gray-light">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <div className="inline-block bg-ninja-orange p-3 rounded-lg mb-4">
                <FireIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
                {isLoginView ? 'Bem-vindo ao NinjaRank' : 'Crie sua Conta'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
                {isLoginView ? 'Entre com sua conta para continuar' : 'Preencha os dados para se cadastrar'}
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="sr-only">Nome</label>
                <input
                  id="name" name="name" type="text" required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-ninja-blue focus:border-ninja-blue focus:z-10 sm:text-sm"
                  placeholder="Nome Completo" value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address" name="email" type="email" autoComplete="email" required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLoginView ? 'rounded-t-md' : ''} focus:outline-none focus:ring-ninja-blue focus:border-ninja-blue focus:z-10 sm:text-sm`}
                placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password" name="password" type="password" autoComplete="current-password" required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-ninja-blue focus:border-ninja-blue focus:z-10 sm:text-sm"
                placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ninja-blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {loading && <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
              {isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-gray-600">
            {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button onClick={toggleView} className="font-medium text-ninja-blue hover:text-indigo-500 ml-1">
              {isLoginView ? 'Cadastre-se' : 'Faça login'}
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
