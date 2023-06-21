import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';
import { TextInputMask } from 'react-native-masked-text';

import { postUsuario } from '../../../api';
import { celular } from '../../../models/celular';
import { Ionicons } from '@expo/vector-icons'

const Cadastro = () => {
  const [nomeCliente, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setpassword] = useState('');
  const [confirmarpassword, setConfirmarpassword] = useState('');
  const [celulares, setCelulares] = useState<celular[]>([{ celularID: 0, celularN: '', clienteID: 0 }]); // array to store phone numbers
  const [e_Mail, sete_Mail] = useState('');
  const [dataNacs, setdataNacs] = useState('');
  const cpfref = useRef(null);
  const [hidepass, sethidepass] = useState(true);
  const [hidepassconfirma, sethidepassconfirma] = useState(true);
  const handleCadastro = async () => {
    const codigo = "";
    const clienteID = 0;
    try {
      const cliente = {
        clienteID,
        nomeCliente,
        cpf,
        e_Mail,
        dataNacs,
        password,
        codigo
      };

      const novoUsuario = await postUsuario(cliente,confirmarpassword,celulares);
      console.log('Sucesso! Usuário cadastrado:', novoUsuario);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
    }
  };

  const handleAddCelular = () => {
    setCelulares([...celulares]); // add an empty phone number field
  };

  const handleCelularChange = (value : any, index: any) => {
    const updatedCelulares = [...celulares];
    updatedCelulares[index] = value;
    setCelulares(updatedCelulares);
  };

  const handleRemoveCelular = (index: any) => {
    if (celulares.length === 1) {
      return; // Don't allow removing the last celular field
    }

    const updatedCelulares = [...celulares];
    updatedCelulares.splice(index, 1);
    setCelulares(updatedCelulares);
  };

  

  return (
    <ScrollView>
      <View style={[styles.cadastro]}>
        <Text style={[styles.formlabel,styles.titlecadastro]}>Cadastro</Text>
        <TextInput
          style={[styles.input,styles.inputform]}
          placeholder="Nome Completo *"
          value={nomeCliente}
          onChangeText={setNome}
        />
        <TextInputMask
        style={[styles.input,styles.inputform]}
        type={'cpf'}
          placeholder="CPF *"
          value={cpf}
          onChangeText={setCpf}
          ref={cpfref}
        />
        <View style={[styles.inputsenhacadastro,{flexDirection:'row',backgroundColor:"#FFF",alignItems:'center',borderRadius:10,borderBottomColor:'#000',borderWidth:1,height:60}]}>
          <TextInput
          style={[styles.inputsenha,styles.inputsenhacadastro]}
            placeholder="Senha *"
            secureTextEntry={hidepass}
            value={password}
            onChangeText={setpassword}
          />
          <TouchableOpacity style={{width:"15%"}} onPress={()=> sethidepass(!hidepass)}>
            { hidepass ?
              <Ionicons name="eye" color="#000" size={25}></Ionicons>
              :
              <Ionicons name="eye-off" color="#000" size={25}></Ionicons>
            }
          </TouchableOpacity>
        </View>
        <View style={[styles.inputsenhacadastro,{flexDirection:'row',backgroundColor:"#FFF",alignItems:'center',borderRadius:10,borderBottomColor:'#000',borderWidth:1,height:60}]}>
        <TextInput
        style={[styles.inputsenha,styles.inputsenhacadastro]}
          placeholder="Confirmar Senha *"
          secureTextEntry={hidepassconfirma}
          value={confirmarpassword}
          onChangeText={setConfirmarpassword}
        />
        <TouchableOpacity style={{width:"15%"}} onPress={()=> sethidepassconfirma(!hidepassconfirma)}>
            { hidepassconfirma ?
              <Ionicons name="eye" color="#000" size={25}></Ionicons>
              :
              <Ionicons name="eye-off" color="#000" size={25}></Ionicons>
            }
          </TouchableOpacity>
        </View>

        {celulares.map((celular, index) => (
          <View key={index}>
            <TextInputMask
              style={[styles.input,styles.inputform,styles.celular]}
              type={'cel-phone'}
              options={{maskType:'BRL',withDDD:true,dddMask:'(999) '}}
              placeholder="Celular"
              value={celular.celularN}
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
        
        <TextInput
          placeholder="e_Mail"
          value={e_Mail}
          onChangeText={sete_Mail}
        style={[styles.input,styles.inputform,{top:10}]}
        />
        <TextInputMask
        style={[styles.input,styles.inputform,{top:10,marginBottom:30}]}
        type={'datetime'}
        options={{
          format: 'DD/MM/YYYY'
        }}
          placeholder="Data de Nascimento *"
          value={dataNacs}
          onChangeText={setdataNacs}
          
        />
        <Button title="Cadastrar" onPress={handleCadastro} />
      </View>
    </ScrollView>
  );
};

export default Cadastro;
