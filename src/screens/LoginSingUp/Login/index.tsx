import React, { useState } from 'react';
import { View, TextInput, Text, ImageBackground, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/Stack/Models';
import { loginUser } from '../../../api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<propsStack>();

  const handleLogin = async () => {
    const cliente = {
      email,
      password
    };
    const result = await loginUser(cliente);
    console.log(result);
    if (result === 'success') {
      navigation.navigate('Home');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Cadastro');
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
