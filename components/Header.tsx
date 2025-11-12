
import React, { useContext } from 'react';
import { MoonIcon, BellIcon, LogoutIcon } from './Icons';
import { AuthContext } from '../context/AuthContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <MoonIcon />
        </button>
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
          <BellIcon />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-ninja-orange flex items-center justify-center font-bold text-white">
            {user?.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">Cliente</p>
          </div>
        </div>
        <button onClick={logout} title="Sair" className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600">
            <LogoutIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
