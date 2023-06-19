import axios from 'axios';
import {Cliente} from './models/usuario'
import { LoginUser } from './models/loginUser';
import { celular } from './models/celular';
import AsyncStorage from '@react-native-async-storage/async-storage';
let TokenAutorizado: string | null;
const API_URL = 'http://192.168.1.2:5141';

export const getFazendasDoUsuario = async (clienteID:string) => {
    try {
      const response = await axios.get(`${API_URL}/api/Fazenda`, {
        headers: {
          Authorization: `Bearer ${TokenAutorizado}`,
          Accept: 'application/json'
        },
      });
      const fazendas = response.data;
      return fazendas;
    } catch (error) {
      console.error('Erro ao obter fazendas:', error);
    }
  };
  
export const getClima = async (variavel:string,data:string,latitude:number,longitude:number)=>{
  try {
    
    const token = '649da341-a94d-39fe-a84e-52f3d033de63'; // Substitua 'seu_token_aqui' pelo seu token de autorização válido
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };
    latitude=-22.817829579132503
    longitude=-47.06143527737295
    const response = await axios.get(`https://api.cnptia.embrapa.br/climapi/v1/ncep-gfs/${variavel}/${data}/${longitude}/${latitude}`, {
      headers: headers,
    });

    const dados = response.data;
    dados.forEach((objeto : any) => {
      const horas = objeto.horas;
      const valor = objeto.valor;

       console.log(`Horas: ${horas}, Valor: ${valor}`);
    });

    return response;
  } catch (error) {
    console.error('Erro ao obter fazendas:', error);
  }
};

export const postUsuario = async (cliente: Cliente,confirmPassword : string,celulares : celular[]) => {
  try {
    cliente.dataNacs = "2023-06-18";
    console.log(celulares);
    const clientUser = {
      "email" : cliente.e_Mail,
      "password" : cliente.password,
      "confirmPassword": confirmPassword
    }
    await axios.post('http://192.168.1.2:5141/api/Values/CreateUser', clientUser);

    // if(result == null)
    //   return;
    await axios.post('http://192.168.1.2:5141/api/Cliente', cliente);
    // const clienteID : any =
    // if(clienteID != 0){
    //   celulares.forEach(async celular => {
    //     celular.clienteID = clienteID;
    //     await axios.post('http://192.168.1.2:5141/api/Celular', celular);
    //   });
    // }
    return;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};

export const loginUser = async (cliente: LoginUser) => {
  try {
    const response = await axios.post('http://192.168.1.2:5141/api/Values/LoginUser', cliente);
    if (response.data && response.data.token) {
      const authToken = response.data.token;
      await AsyncStorage.setItem('authToken', authToken);

      TokenAutorizado = await AsyncStorage.getItem('authToken');
      return "success";
    } else {
      throw new Error('Token de autenticação não encontrado na resposta da API.');
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error; // Relança o erro para ser tratado posteriormente
  }
};


export const getUserId = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Values/id`, {
      headers: {
        Authorization: `Bearer ${TokenAutorizado}`,
      },
    });
    const userId = response.data;
    return userId;
  } catch (error) {
    console.error('Erro ao obter o ID do usuário:', error);
    return null;
  }
};