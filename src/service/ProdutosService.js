import {
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
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebaseConnections";
const usuarioCollection = collection(db, "usuario");


//Criar produto
export const criarUsuario = async (usuario) =>{
    const payload ={
        nome: usuario.nome,
        telefone: usuario.telefone,
        cpf: usuario.cpf,
        logradouro: usuario.logradouro,
        bairro: usuario.bairro,
        cidade: usuario.cidade,
        uf: usuario.uf,
        createdAt: serverTimestamp()
    };
    const ref = await addDoc(usuarioCollection,payload);
    return ref.id;
};

//ler todos (snapshot em tempo real)
export const subscribeProdutos = (callback) => {
    const q = query(usuarioCollection, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot)=>{
        const itens = snapshot.docs.map((d) => ({id: d.id, ...d.data()}));
        callback(itens);
    });
};

//ler todos
export const obterProdutos = async () => {
    const snap = await getDocs (usuarioCollection);
    return snap.docs.map((d) => ({id: d.id, ...d.data()}));
};

//ler um por id
export const obterProdutosPorId = async (id) =>{
    const docRef = doc(db, "usuario", id);
    const d = await getDoc(docRef);
    if (!d.exists()) return null;
    return {id: d.id, ...d.data()};
};

//Atualizar
export const atualizarpPoduto = async (id, dados) =>{
    const docRef = doc(db, "usuario", id);
    await updateDoc(docRef, { ...dados, updatedAt: serverTimestamp()});
};

//deletar
export const deletarProduto = async (id) => {
    const docRef = doc(db, "usuario", id);
    await deleteDoc(docRef);
};


//Correções feitas
//linha 32  const q = query(usuarioCollection, orderBy("createdAt", "desc"));(createdAt)
//linha 42 return snap.docs.map((d) => ({id: d.id, ...d.data()})); (data())
//Corrigir imports