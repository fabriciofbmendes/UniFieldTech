import axios from 'axios';
import {Cliente} from './models/usuario'
import { LoginUser } from './models/loginUser';
import { celular } from './models/celular';
import * as Location from 'expo-location';
import {fazendaCadastro} from './interfaces/fazendaCadastro';
import {temperaturas} from './models/temperaturas';
import AsyncStorage from '@react-native-async-storage/async-storage';
let TokenAutorizado: string | null;
const API_URL = 'http://192.168.1.3:5141';

export const getFazendasDoUsuario = async (cpf:string) => {
    try {
      TokenAutorizado = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/api/Fazenda/buscar/cliente/cpf/${cpf}`, {
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

export const getTemp = async (latitude : number, longitude : number) => {
  console.log(latitude);
  console.log(longitude);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}1&hourly=relativehumidity_2m,precipitation_probability,precipitation,rain,cloudcover,windspeed_10m,winddirection_10m,temperature_80m,uv_index,uv_index_clear_sky,temperature_925hPa,relativehumidity_925hPa,cloudcover_925hPa,windspeed_925hPa,winddirection_925hPa&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&current_weather=true&timezone=America%2FSao_Paulo`
  try {
    const response = await axios.get(url);
    // const dados = temperaturas;
    //console.log(response.data.current_weather);
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature:', error);
  }
};

export const postUsuario = async (cliente: Cliente,confirmPassword : string) => {
  try {
    cliente.dataNacs = "2023-06-18";
    const clientUser = {
      "email" : cliente.e_Mail,
      "password" : cliente.password,
      "confirmPassword": confirmPassword
    }
    await axios.post('http://192.168.1.3:5141/api/Values/CreateUser', clientUser);

    // if(result == null)
    //   return;
    await axios.post('http://192.168.1.3:5141/api/Cliente', cliente);
    // const clienteID : any =
    // if(clienteID != 0){
    //   celulares.forEach(async celular => {
    //     celular.clienteID = clienteID;
    //     await axios.post('http://192.168.1.3:5141/api/Celular', celular);
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
    const response = await axios.post('http://192.168.1.3:5141/api/Fazenda', fazenda, {
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
    const response = await axios.post('http://192.168.1.3:5141/api/Values/LoginUser', cliente);
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

export const getUserCpf = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Values/cpf`, {
      headers: {
        Authorization: `Bearer ${TokenAutorizado}`,
      },
    });
    const userCpf = response.data;
    return userCpf;
  } catch (error) {
    console.error('Erro ao obter o ID do usuário:', error);
    return null;
  }
};

export const PupularDropdownPlantacao = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Fazenda/plantacoes`, {
      headers: {
        Authorization: `Bearer ${TokenAutorizado}`,
      },
    });
    const plantacoes = response.data;
    return plantacoes;
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