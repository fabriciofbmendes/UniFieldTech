import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';

import { postUsuario } from '../../../api';
import { celular } from '../../../models/celular';
import { propsStack } from '../../../routes/Stack/Models';
import { useNavigation } from '@react-navigation/native';
const Cadastro = () => {
  const [nomeCliente, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setpassword] = useState('');
  const [confirmarpassword, setConfirmarpassword] = useState('');
  const [CelularN, setCelular] = useState('');
  const [e_Mail, sete_Mail] = useState('');
  const [dataNacs, setdataNacs] = useState('');
  const navigation = useNavigation<propsStack>();

  const handleCadastro = async () => {
    const codigo = "";
    const clienteID = 0;
    try {
      const cliente = {
        clienteID,
        nomeCliente,
        cpf,
        CelularN,
        e_Mail,
        dataNacs,
        password,
        codigo
      };

      const novoUsuario = await postUsuario(cliente,confirmarpassword);
      console.log('Sucesso! Usuário cadastrado:', novoUsuario);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  return (
    <View style={styles.cadastro}>
      <Text style={styles.formlabel}>Cadastro</Text>
      <TextInput
        style={[styles.input,styles.inputform]}
        placeholder="Nome Completo *"
        value={nomeCliente}
        onChangeText={setNome}
      />
      <TextInput
      style={[styles.input,styles.inputform]}
        placeholder="CPF *"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
      style={[styles.input,styles.inputform]}
        placeholder="Senha *"
        secureTextEntry
        value={password}
        onChangeText={setpassword}
      />
      <TextInput
      style={[styles.input,styles.inputform]}
        placeholder="Confirmar Senha *"
        secureTextEntry
        value={confirmarpassword}
        onChangeText={setConfirmarpassword}
      />

    <TextInput
        placeholder="Numero do Celular"
        value={CelularN}
        onChangeText={setCelular}
      style={[styles.input,styles.inputform,{top:10}]}
      />
      <TextInput
        placeholder="e_Mail"
        value={e_Mail}
        onChangeText={sete_Mail}
      style={[styles.input,styles.inputform,{top:10}]}
      />
      <TextInput
      style={[styles.input,styles.inputform,{top:10}]}
        placeholder="Data de Nascimento *"
        value={dataNacs}
        onChangeText={setdataNacs}
      />
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

export default Cadastro;
