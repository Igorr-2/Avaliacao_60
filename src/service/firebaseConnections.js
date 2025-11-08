// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";

// IMPORTANTE: Adicionar autenticação
import { getAuth, signInAnonymously } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCYYtXM91Cixm7ixo1LGJ5m6tNbldORzqM",
    authDomain: "appcadastro-igor.firebaseapp.com",
    projectId: "appcadastro-igor",
    storageBucket: "appcadastro-igor.firebasestorage.app",
    messagingSenderId: "808908252609",
    appId: "1:808908252609:web:7be86837cd80b8717afb40"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Inicializa autenticação

 //CORREÇÃO: CHAMADA DA FUNÇÃO DE AUTENTICAÇÃO AGORA ESTÁ PRESENTE
// ************************************************************
signInAnonymously(auth).then(() => {
    console.log("SUCESSO: Usuário logado anonimamente. O Firestore deve funcionar.");
}).catch((error) => {
    // Isso deve alertar se o Firebase Auth não estiver habilitado para seu projeto.
    console.error("ERRO CRÍTICO: Não foi possível logar anonimamente. Verifique se o Firebase Auth (Login Anônimo) está habilitado.", error);
});


const produtosCollection = collection(db, "produtos");

export{
    db,
    produtosCollection,
    collection,
    addDoc,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    serverTimestamp
};

