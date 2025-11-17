import { Platform, StyleSheet, Text, View, Button, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { criarUsuario, obterProdutosPorId, atualizarpPoduto } from '../service/ProdutosService';

export default function CadastroScreen({ route, navigation }) {
  const idUsuario = route?.params?.idUsuario || null;

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [CPF, setCPF] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [UF, setUF] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (idUsuario) {
      const fetchUsuario = async () => {
        setLoading(true);
        try {
          const usuario = await obterProdutosPorId(idUsuario);
          if (usuario) {
            setNome(usuario.nome || '');
            setTelefone(usuario.telefone || '');
            setCPF(usuario.cpf || '');
            setCep(usuario.cep || '');
            setLogradouro(usuario.logradouro || '');
            setBairro(usuario.bairro || '');
            setCidade(usuario.cidade || '');
            setUF(usuario.uf || '');
          }
        } catch (error) {
          console.error("Erro ao carregar dados para edição:", error);
          Alert.alert("Erro!", "Erro ao carregar dados para edição.");
        } finally {
          setLoading(false);
        }
      };
      fetchUsuario();
    }
  }, [idUsuario]);

  const buscarCep = async () => {
    if (cep.length !== 8) {
      if (cep.length > 0) {
        Platform.OS === 'web'
          ? window.alert('Por favor, insira um CEP válido com 8 dígitos!')
          : Alert.alert('Erro!', 'Por favor, insira um CEP válido com 8 dígitos!');
      }
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setUF(data.uf || '');
      } else {
        Platform.OS === 'web' ? window.alert('CEP não encontrado!') : Alert.alert('Erro!', 'CEP não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Platform.OS === 'web' ? window.alert('Erro ao consultar o CEP!') : Alert.alert('Erro!', 'Erro ao consultar o CEP!');
    }
  };

  const handlerCadastro = async () => {
    if (nome === '' || CPF === '' || logradouro === '') {
      Platform.OS === 'web'
        ? window.alert('Por favor, preencha os campos obrigatórios (Nome, CPF, Logradouro)!')
        : Alert.alert('Erro!', 'Por favor, preencha os campos obrigatórios (Nome, CPF, Logradouro)!');
      return;
    }

    if (!idUsuario && cep === '') {
      Platform.OS === 'web'
        ? window.alert('CEP é obrigatório para novos cadastros!')
        : Alert.alert('Erro!', 'CEP é obrigatório para novos cadastros!');
      return;
    }


    const dadosUsuario = {
      nome,
      telefone,
      cpf: CPF,
      cep,
      logradouro,
      bairro,
      cidade,
      uf: UF,
    };

    try {
      if (idUsuario) {
        await atualizarpPoduto(idUsuario, dadosUsuario);
        Platform.OS === 'web' ? window.alert('Usuário atualizado com sucesso!') : Alert.alert('Sucesso!', 'Usuário atualizado com sucesso!');
        navigation.goBack();
      } else {
        await criarUsuario(dadosUsuario);
        Platform.OS === 'web' ? window.alert('Usuário cadastrado com sucesso!') : Alert.alert('Sucesso!', 'Usuário cadastrado com sucesso!');
      }

      if (!idUsuario) {
        setNome('');
        setTelefone('');
        setCPF('');
        setCep('');
        setLogradouro('');
        setBairro('');
        setCidade('');
        setUF('');
      }
    } catch (error) {
      console.error(`Erro ao ${idUsuario ? 'atualizar' : 'cadastrar'} o usuário`, error);
      Platform.OS === 'web' ? window.alert(`Erro ao ${idUsuario ? 'atualizar' : 'cadastrar'} o usuário.`) : Alert.alert('Erro!', `Erro ao ${idUsuario ? 'atualizar' : 'cadastrar'} o usuário.`);
    }
  };

  const buttonTitle = idUsuario ? "Atualizar" : "Cadastrar";

  if (idUsuario && loading) {
    return <ActivityIndicator style={styles.container} size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome Completo *</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome completo"
        style={styles.input}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        placeholder="(xx) xxxxx-xxxx"
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>CPF *</Text>
      <TextInput
        value={CPF}
        onChangeText={setCPF}
        keyboardType="numeric"
        placeholder="xxx.xxx.xxx-xx"
        style={styles.input}
      />

      <Text style={styles.label}>CEP *</Text>
      <TextInput
        value={cep}
        onChangeText={setCep}
        keyboardType="numeric"
        placeholder="Digite o CEP"
        style={styles.input}
        onBlur={buscarCep}
      />

      <Text style={styles.label}>Logradouro *</Text>
      <TextInput
        value={logradouro}
        onChangeText={setLogradouro}
        placeholder="Digite o seu endereço"
        style={styles.input}
      />

      <Text style={styles.label}>Bairro</Text>
      <TextInput
        value={bairro}
        onChangeText={setBairro}
        placeholder="Digite seu bairro"
        style={styles.input}
      />

      <Text style={styles.label}>Cidade</Text>
      <TextInput
        value={cidade}
        onChangeText={setCidade}
        placeholder="Digite sua cidade"
        style={styles.input}
      />

      <Text style={styles.label}>UF</Text>
      <TextInput
        value={UF}
        onChangeText={setUF}
        placeholder="UF"
        style={styles.input}
      />

      <Button title={buttonTitle} onPress={handlerCadastro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});