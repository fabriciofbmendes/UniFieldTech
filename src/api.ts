import axios from 'axios';
import {Cliente} from './models/usuario'
const API_URL = 'https://192.168.1.2:5141';

export const getFazendasDoUsuario = async (idUsuario:string) => {
    try {
      const response = await axios.get(`${API_URL}/fazendas?usuario=${idUsuario}`);
      const fazendas = response.data;
      return fazendas;
    } catch (error) {
      console.error('Erro ao obter fazendas:', error);
    }
  };
  
export const getClima = async (variavel:string,data:string,latitude:number,longitude:number)=>{
  try {
    console.log(variavel,data,longitude,latitude);
    const token = 'cec2bb5f-34d6-3fbb-b6d6-36895289c148'; // Substitua 'seu_token_aqui' pelo seu token de autorização válido
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };
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

export const postUsuario = async (cliente: Cliente) => {
  try {
    cliente.dataNacs = "2023-06-18";
    console.log('Passei Aqui:' + JSON.stringify(cliente));
    await axios.post('http://192.168.1.2:5141/api/Cliente', cliente);
    return;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};