import { Alert, Button, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState, } from "react";
import { criarUsuario } from "../service/ProdutosService";
import api from "../service/api";


export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [uf, setUF] = useState("");

  const handlerCadastro = async () => {
    if (nome === "" || telefone === "" || cpf === "" || logradouro === "" || bairro === "" || cidade === "" || uf === "") {
      Platform.OS === "web"
        ? window.alert("Por favor, preencha todos os campos.")
        : Alert.alert("Erro!", "Por favor, preencha todos os campos.");
      return;
    }

    const novo = {
      nome,
      telefone,
      cpf,
      logradouro,
      bairro,
      cidade,
      uf,
    };

    try {
      const id = await criarUsuario(novo);
      Platform.OS === "web"
        ? window.alert("Usuario cadastrado com sucesso!")
        : Alert.alert("Sucesso!", "Usuario cadastrado com sucesso!");
      setNome("");
      setTelefone("");
      setCpf("");
      setLogradouro("");
      setBairro("");
      setCidade("");
      setUF("");
    } catch (error) {
      console.error("Erro ao cadastrar usuario", error);
      Platform.OS === "web"
        ? window.alert("Erro ao cadastrar usuario. Tente novamente")
        : Alert.alert("Erro!", "Erro ao cadastrar usuario. Tente novamente");
    }
  };
  return (

    <View style={styles.container}>
      <Text style={styles.styleText}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome completo"
      />

      <Text style={styles.styleText}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Digite o telefone"
      />

      <Text style={styles.styleText}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        placeholder="Digite o CPF"
      />

      <Text style={styles.styleText}>Logradouro</Text>
      <TextInput
        style={styles.input}
        value={logradouro}
        onChangeText={setLogradouro}
        placeholder="Logradouro"
      />

      <Text style={styles.styleText}>Bairro</Text>
      <TextInput
        style={styles.input}
        value={bairro}
        onChangeText={setBairro}
        placeholder="Bairro"
      />

      <Text style={styles.styleText}>Cidade</Text>
      <TextInput
        style={styles.input}
        value={cidade}
        onChangeText={setCidade}
        placeholder="Cidade"
      />

      <Text style={styles.styleText}>UF(Estado)</Text>
      <TextInput
        style={styles.input}
        value={uf}
        onChangeText={setUF}
        placeholder="Estado(UF)"
      />
      <Button title="Cadastrar" onPress={handlerCadastro} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f0f0f0"
  },
  styleText: {
    marginBottom: 5,
    marginTop: 15
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5
  },
});