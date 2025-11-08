import { StyleSheet, Text, View,
ScrollView, Platform, Alert,
Button, ActivityIndicator, TextInput } from "react-native";
import React, {useEffect, useState}from "react";

import {doc, getDoc, updateDoc, deleteDoc} from "firebase/firestore";
import {db} from "../service/firebaseConnections";

export default function DetalhesScreen({route, navigation}) {
  const {idProduto} = route.params;
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] =useState(true);
  const [editando, setEditando] = useState(false);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");


  useEffect(() =>{
    const carregarProduto =async() =>{
      try{
      const docRef = doc(db, "produtos", idProduto);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()){
        const data = docSnap.data();
        console.log("DADOS DO PRODUTO:", data);
        setProduto(data);
        setPreco(String(data.preco));
        setNome(data.nome);
        setDescricao(data.descricao);
      } else {
        Alert.alert("Erro ao carregar produto: ", error);
        navigation.goBack();
      }      
    }catch (error){
    }  finally {
        setLoading(false);
      }
      };
      carregarProduto();
    }, []);

    const handleAtualizar = async () => {
      if (!nome || !preco || !descricao){
        Platform.OS ==="web"
        ?window.alert("Preencha todos os campos antes de atualizar! ")
        : Alert.alert("Aviso", "Preencha todos os campos antes de atualizar! ");
        return;
      }
      try {
        const produtoRef = doc(db, "produtos", idProduto);
        await updateDoc(produtoRef, {
          nome,
          preco: parseFloat(preco),
          descricao,
        });
      
        setEditando(false);
      
        if (Platform.OS === "web") {
          window.alert("Produto atualizado com sucesso!");
        } else {
          Alert.alert("Sucesso", "Produto atualizado com sucesso!");
        }
      
      } catch (error) {
        console.error("Erro ao atualizar:", error);
        if (Platform.OS === "web") {
          window.alert("Não foi possível atualizar o produto.");
        } else {
          Alert.alert("Erro", "Não foi possível atualizar o produto.");
        }
      }
    };

  const handleExcluir = async ()=> {
    if (Platform.OS === "web") {
      const confirmar = window.confirm("Deseja realmente excluir este produto?");
      if (!confirmar) return;

      try{
        const produtoRef = doc(db,"produtos", idProduto);
        await deleteDoc (produtoRef);
        alert("Produto excuído com sucesso!");
        navigation.goBack();
      } catch(error) {
        console.error("Erro ao deletar:", error);
        alert("Não foi possível excluir o produto. ");
      }

    } else{
      Alert.alert("Confirmação", "Deseja realmente excluir este produto?",[
      {text: "Cancelar", style: "cancel"},
      {
        text: "Excluir",
        style: "destructive",
        onPress: async() =>{  
          try {
            const produtoRef = doc(db, "produtos", idProduto);
            await deleteDoc(produtoRef);
            Alert.alert("Excluído", "Produto removido com sucesso!")
            navigation.goBack();
          } catch (error) {
            console.error("Erro ao deletar: ", error);
            Alert.alert("Erro", "não foi possível deletar o produto");
          }     
        },
      }, 
    ]);
    }
  };


  if(loading) return <ActivityIndicator style={{flex:1}} size="large" />;
    // Platform.OS ==="web"
    //   ? window.alert("Lista de produtos vazia")
    //   :Alert.alert("Erro!", "Lista de produtos vazia" );  

  return (

      <ScrollView style = {styles.container}>
        <Text style ={styles.title}>Detalhes do produto</Text>

        <Text style ={styles.label}>Nome: </Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          editable={editando}
        />

        <Text style ={styles.label}>Preço: </Text>
        <TextInput
          style={styles.input}
          value={preco}
          onChangeText={setPreco}
          editable={editando}
          keyboardType="numeric"
        />

        <Text style ={styles.label}>Descrição: </Text>
        <TextInput
          style={[styles.input, {  height:100}]}
          value={descricao}
          onChangeText={setDescricao}
          editable={editando}
          multiline
        />
       
      <View style={styles.botoes}>
        {!editando? (
          <Button title="Editar" onPress={() => setEditando(true)}/>
        ) : (
          <Button title="Salvar Alterações" onPress={handleAtualizar}/>
        )}   
      </View >

      <View style={styles.botoes}>
        <Button title="Excluir Produto" color="red" onPress={handleExcluir}/>
      </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding:20,
      backgroundColor: "#f0f0f0"
    },

    title:{
      fontSize:25,
      fontWeight: "bold",
      marginBottom:20,
      textAlign: "center"
    },
    
    label:{
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 5
    },

    input:{
      borderWidth:1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 8,
      marginBottom:10,
    
    },

    botoes:{
      marginTop:10
    },
  });