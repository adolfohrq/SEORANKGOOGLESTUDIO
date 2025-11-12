// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ATENÇÃO: Cole as credenciais do seu projeto Firebase aqui.
// Esta abordagem é para desenvolvimento. Para produção, use variáveis de ambiente.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // SUBSTITUA PELA SUA CHAVE DE API
  authDomain: "YOUR_AUTH_DOMAIN", // SUBSTITUA PELO SEU DOMÍNIO DE AUTENTICAÇÃO
  projectId: "YOUR_PROJECT_ID", // SUBSTITUA PELO ID DO SEU PROJETO
  storageBucket: "YOUR_STORAGE_BUCKET", // SUBSTITUA PELO SEU BUCKET DE ARMAZENAMENTO
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // SUBSTITUA PELO SEU ID DE REMETENTE DE MENSAGENS
  appId: "YOUR_APP_ID", // SUBSTITUA PELO ID DO SEU APLICATIVO
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);
