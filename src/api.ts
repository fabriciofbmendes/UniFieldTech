import axios from 'axios';

const API_URL = 'http://192.168.1.2:3000';

export const getFazendasDoUsuario = async (idUsuario:string) => {
    try {
      const response = await axios.get(`${API_URL}/fazendas?usuario=${idUsuario}`);
      const fazendas = response.data;
      return fazendas;
    } catch (error) {
      console.error('Erro ao obter fazendas:', error);
    }
  };
  
