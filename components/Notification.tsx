
import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon } from './Icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? CheckCircleIcon : AlertTriangleIcon;

  return (
    <div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-pulse ${bgColor}`}>
      <Icon className="w-6 h-6 mr-3" />
      <span>{message}</span>
    </div>
  );
};

export default Notification;
