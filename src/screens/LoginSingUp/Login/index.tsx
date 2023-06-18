import React, { useState } from 'react';
import { View, TextInput, Text, ImageBackground,  Button, StyleSheet } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/Stack/Models';
import { TouchableOpacity } from 'react-native';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<propsStack>();

  

  const handleLogin = () => {
    navigation.navigate("ClimaRegiao")
    // Fazer a requisição para a API de login
    // axios.post('sua_url_de_login', { email, password })
    //   .then(response => {
    //     // Lógica para lidar com a resposta da API após o login
    //     console.log('Usuário logado com sucesso:', response.data);

    //   })
    //   .catch(error => {
    //     // Lógica para lidar com erros durante o login
    //     console.error('Erro no login:', error);
    //   });
  };

  const handleSignUp = () => {
    // Fazer a requisição para a API de cadastro
    // axios.post('sua_url_de_cadastro', { email, password })
    //   .then(response => {
    //     // Lógica para lidar com a resposta da API após o cadastro
    //     console.log('Usuário cadastrado com sucesso:', response.data);
    //   })
    //   .catch(error => {
    //     // Lógica para lidar com erros durante o cadastro
    //     console.error('Erro no cadastro:', error);
    //   });
    navigation.navigate("Cadastro");

  };

  return (
    <View style={styles.container}>
      
      <ImageBackground source={require('../../img/fundo-login.jpg')} style={styles.fundo}>
        <Text style={styles.title}>AgrofieldTech</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
        />
        <View style={styles.buttondiv}>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleLogin}
          >
            <Text >Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles.button}
          >
            <Text >Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;



