import axios from 'axios';
import {Cliente} from './models/usuario'
import { LoginUser } from './models/loginUser';
import { celular } from './models/celular';
import * as Location from 'expo-location';
import {fazendaCadastro} from './interfaces/fazendaCadastro';
import AsyncStorage from '@react-native-async-storage/async-storage';
let TokenAutorizado: string | null;
const API_URL = 'http://192.168.1.2:5141';

export const getFazendasDoUsuario = async (clienteID:string) => {
    try {
      TokenAutorizado = await AsyncStorage.getItem('authToken');
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

const getTemp = async (latitude : number, longitude : number) => {
  latitude = -22.817829579132503
  longitude = -47.06143527737295
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&forecast_days=1&timezone=America%2FSao_Paulo`;

  try {
    const response = await axios.get(url);
    //setData(response.data);
    console.log(response.data.current_weather);
  } catch (error) {
    console.error('Error fetching temperature:', error);
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


export const cadastrarFazenda = async (fazenda : fazendaCadastro) => {
  TokenAutorizado = await AsyncStorage.getItem('authToken');
    try {
    const response = await axios.post('http://192.168.1.2:5141/api/Fazenda', fazenda, {
      headers: {
        Authorization: `Bearer ${TokenAutorizado}`,
        Accept: 'application/json'
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.log('Erro na resposta:', error.response.data);
      console.log('Status do erro:', error.response.status);
      console.log('Headers da resposta:', error.response.headers);
    } else if (error.request) {
      console.log('Erro na requisição:', error.request);
    } else {
      console.log('Erro desconhecido:', error.message);
    }
    throw error;
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


export async function getCoordinates(address: string): Promise<{ latitude: string; longitude: string }> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permissão de localização não foi concedida.');
    }

    const geocode = await Location.geocodeAsync(address);
    if (geocode.length > 0) {
      const { latitude, longitude } = geocode[0];
      return { latitude: latitude.toString(), longitude: longitude.toString() };
    } else {
      throw new Error('Nenhum resultado encontrado para o endereço fornecido.');
    }
  } catch (error) {
    throw new Error('Erro ao buscar as coordenadas do endereço.');
  }
}