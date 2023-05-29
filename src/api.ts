import axios from 'axios';

const API_URL = 'http://10.1.12.28:3000';

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