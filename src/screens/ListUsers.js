import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { deletarProduto } from "../service/ProdutosService";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { subscribeUsuario } from "../service/ProdutosService";

export default function ListUsers() {
  const navigation = useNavigation();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExcluir = async (idProduto) => {
    if (Platform.OS === "web") {
      console.log("Tentando excluir ID:", idProduto);
      const confirmar = window.confirm("Deseja realmente excluir este usuário?");
      if (!confirmar) return;
    }

    try {
      await deletarProduto(idProduto);
      alert("Usuário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir o usuário.");
    }
  };


  useEffect(() => {
    const unsubscribe = subscribeUsuario((itens) => {
      setUsuarios(itens);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Detalhes", { idProduto: item.id })}
      >
        <Text style={styles.produto}>Nome: {item.nome}</Text>
        <Text style={styles.precoproduto}>Telefone: {item.telefone}</Text>
        <Text style={styles.precoproduto}>CPF: {item.cpf}</Text>
        <Text style={styles.precoproduto}>Logradouro: {item.logradouro}</Text>
        <Text style={styles.precoproduto}>Cidade: {item.cidade}</Text>
        <Text style={styles.precoproduto}>Bairro: {item.bairro}</Text>
        <Text style={styles.precoproduto}>UF: {item.uf}</Text>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => navigation.navigate("Cadastro", { idUsuario: item.id })}
        >
          <Text style={styles.textoBotao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => handleExcluir(item.id)}
        >
          <Text style={styles.textoBotao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios Cadastrados</Text>
      {usuarios.length > 0 ? (
        <FlatList
          data={usuarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noData}>Nenhum produto cadastrado!</Text>
      )}

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.textoBotao}>+</Text>
      </TouchableOpacity>


    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  produto: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBlockColor: '#ccc'
  },
  precoproduto: {
    fontSize: 16,
    color: '#555',
    marginTop: 5
  },

  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    marginTop: 50
  },

  botaoAdicionar: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#2196F3",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  botaoEditar: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  botaoExcluir: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
})