import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import stilo from '../../styles';
import { getClima, getFazendasDoUsuario, getUserId } from '../../api';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/Stack/Models';
import { HumidadeAcimaDoSolo } from '../../interfaces/climApiVariables';
import moment from 'moment';


const Home = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const navigation = useNavigation<propsStack>();
  const currentDate = moment().format('YYYY-MM-DD');
  const [clima, setClima] = useState<[]>([]);
  useEffect(() => {
    const fetchFazendas = async () => {
      try {
        const response = JSON.stringify(await getFazendasDoUsuario(await getUserId()));
        setFazendas(JSON.parse(response));
      } catch (error) {
        console.error('Erro ao obter fazendas:', error);
      }
    };

    fetchFazendas();
  }, []);

  const handleFazendaClick = async (fazenda: Fazenda) => {
    // Navegar para a tela do mapa e passar os valores da fazenda
    const clima = JSON.stringify(await getClima(HumidadeAcimaDoSolo,currentDate,fazenda.longitude,fazenda.latitude));
    
    navigation.navigate("Fazenda", {
      latitude: fazenda.latitude,
      longitude: fazenda.longitude,
      hectares: fazenda.hectar,
    });
  };


  const handleCadastrarFazenda = () => {
    // Navegar para a tela de cadastro de fazenda
    navigation.navigate('CadastroFazenda');
  };

  return (
    <View>
    <TouchableOpacity onPress={handleCadastrarFazenda}>
        <Text>Cadastrar Fazenda</Text>
      </TouchableOpacity>
      {fazendas.map((fazenda) => (
        <TouchableOpacity
          key={fazenda.fazendaID}
          onPress={() => handleFazendaClick(fazenda)}
        >
          <Text>{fazenda.nomeFazenda}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Home;
