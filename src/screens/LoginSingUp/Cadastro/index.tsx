import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [celulares, setCelulares] = useState(['']); // array to store phone numbers
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleCadastro = async () => {
    try {
      const response = await axios.post('https://sua-api.com/cadastro', {
        nome,
        cpf,
        senha,
        confirmarSenha,
        celulares,
        email,
        dataNascimento,
      });
      console.log('Sucesso! Usuário cadastrado:', response.data);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  const handleAddCelular = () => {
    setCelulares([...celulares, '']); // add an empty phone number field
  };

  const handleCelularChange = (value : any, index :any) => {
    const updatedCelulares = [...celulares];
    updatedCelulares[index] = value;
    setCelulares(updatedCelulares);
  };

  const handleRemoveCelular = (index : any) => {
    if (celulares.length === 1) {
      return; // Don't allow removing the last celular field
    }

    const updatedCelulares = [...celulares];
    updatedCelulares.splice(index, 1);
    setCelulares(updatedCelulares);
  };

  return (
    <View style={styles.cadastro}>
      <Text style={styles.formlabel}>Cadastro</Text>
      <TextInput
        style={[styles.input,styles.inputform]}
        placeholder="Nome Completo *"
        value={nome}
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
        value={senha}
        onChangeText={setSenha}
      />
      <TextInput
      style={[styles.input,styles.inputform]}
        placeholder="Confirmar Senha *"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />

    {celulares.map((celular, index) => (
        <View key={index}>
          <TextInput
            placeholder="Celular"
            value={celular}
            onChangeText={(value) => handleCelularChange(value, index)}
          />
          {index !== 0 && (
            <Button
              title="Remover Celular"
              onPress={() => handleRemoveCelular(index)}
            />
          )}
        </View>
      ))}
      {/* Button to add new celular number input field */}
      <Button title="Adicionar Celular" onPress={handleAddCelular} />

      <TextInput
      style={[styles.input,styles.inputform,{top:10}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
      style={[styles.input,styles.inputform,{top:10}]}
        placeholder="Data de Nascimento *"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
};

export default Cadastro;
