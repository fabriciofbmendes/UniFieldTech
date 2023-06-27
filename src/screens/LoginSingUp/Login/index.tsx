import React, { useState } from 'react';
import { View, TextInput, Text, ImageBackground, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/Stack/Models';
import { loginUser } from '../../../api';
import { Ionicons } from '@expo/vector-icons'

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<propsStack>();
  const [hidepass, sethidepass]=useState(true);
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
        <Text style={{bottom:80,fontSize:35,alignSelf:'center',fontWeight:'bold'}}>AgrofieldTech</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
        />
        <View style={styles.senhadiv}>
          <TextInput 
            style={styles.inputsenha}
            placeholder="Senha"
            secureTextEntry={hidepass}
            onChangeText={text => setPassword(text)}
            value={password}
          />
          <TouchableOpacity style={{width:"15%"}} onPress={()=> sethidepass(!hidepass)}>
            { hidepass ?
              <Ionicons name="eye" color="#000" size={25}></Ionicons>
              :
              <Ionicons name="eye-off" color="#000" size={25}></Ionicons>
            }
          </TouchableOpacity>
        </View>
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
