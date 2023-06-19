import axios from 'axios';

const API_URL = 'http://192.168.0.130:3000';

export const getFazendasDoUsuario = async (idUsuario:string) => {
    try {
      const response = await axios.get(`${API_URL}/fazendas?usuario=${idUsuario}`);
      const fazendas = response.data;
      return fazendas;
    } catch (error) {
      console.error('Erro ao obter fazendas:', error);
    }
  };
  
export const getClima = async (variavel:string,data:string,longitude:number,latitude:number)=>{
  try {
    
    const token = '54e77a8e-d974-3427-b6e0-292d29171f02'; // Substitua 'seu_token_aqui' pelo seu token de autorização válido
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