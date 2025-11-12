
import React from 'react';
import { AlertTriangleIcon } from './Icons';

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">{title}</h3>
            <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">{message}</p>
            </div>
            <div className="items-center px-4 py-3 space-x-2">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700"
                >
                    Confirmar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
