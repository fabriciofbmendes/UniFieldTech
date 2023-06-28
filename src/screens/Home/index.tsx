import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import stilo from '../../styles';
import { getClima, getFazendasDoUsuario, getUserCpf, getTemp } from '../../api';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/Stack/Models';
import { HumidadeAcimaDoSolo } from '../../interfaces/climApiVariables';
import moment from 'moment';
import styles from '../../styles';


const Home = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const navigation = useNavigation<propsStack>();
  const isFocused = useIsFocused();
  const currentDate = moment().format('YYYY-MM-DD');
  const [clima, setClima] = useState<[]>([]);
  useEffect(() => {
    const fetchFazendas = async () => {
      const response = JSON.stringify(await getFazendasDoUsuario(await getUserCpf()));
      try {
        if(response != null && response !== undefined) {
          setFazendas(JSON.parse(response));
        }
      } catch (error) {
        //console.error('Erro ao obter fazendas:', error);
      }
    };

    fetchFazendas();
  }, []);

  const handleFazendaClick = async (fazenda: Fazenda) => {
    // Navegar para a tela do mapa e passar os valores da fazenda
    //const clima = JSON.stringify(await getClima(HumidadeAcimaDoSolo,currentDate,fazenda.longitude,fazenda.latitude));
    //const clima = await getTemp(fazenda.longitude,fazenda.latitude);
    ////console.log(clima);
    navigation.navigate("Fazenda", {
      latitude: fazenda.latitude,
      longitude: fazenda.longitude,
      hectar: fazenda.hectar,
      plantacaoId: fazenda.plantacaoId,
    });
  };


  useEffect(() => {
    const updateFazendas = async () => {
      try {
        const response = await getFazendasDoUsuario(await getUserCpf());
        setFazendas(response);
      } catch (error) {
        //console.error('Erro ao obter fazendas:', error);
      }
    };

    if (isFocused) {
      updateFazendas();
    }
  }, [isFocused]);

  const handleCadastrarFazenda = () => {
    // Navegar para a tela de cadastro de fazenda
    navigation.navigate('CadastroFazenda');
  };

  const handleInformacoes = async (fazenda: Fazenda) => {
    navigation.navigate('CalendarioClima', {
      latitude: fazenda.latitude,
      longitude: fazenda.longitude,
      plantacaoId: fazenda.plantacaoId,
      nomeFazenda: fazenda.nomeFazenda
    });
  };


  return (
    <ScrollView>
      <View style={styles.home}>
        <Text style={{ fontSize: 20, top: 20, fontWeight:'bold' }}>Minhas Fazendas</Text>
        {fazendas.map((fazenda: Fazenda) => (
          <View key={fazenda.fazendaID} style={styles.card}>
            <ImageBackground
              imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
              source={require('../img/fundo-login.jpg')}
              style={styles.fundocard}
            ></ImageBackground>
            <Text style={{bottom:30, fontSize: 20, fontWeight:'bold' }}>{fazenda.nomeFazenda}</Text>
            <View style={{ flexDirection: 'row', gap: 0, top: 10 }}>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.buttoninfo]}
                    onPress={() => handleFazendaClick(fazenda)}
                  >
                    <Text style={{fontWeight:'bold'}}>Ver Região</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    style={[styles.buttoninfo]}
                    onPress={() => handleInformacoes(fazenda)}
                  >
                    <Text style={{fontWeight:'bold'}}>Saiba Mais</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        ))}
        <TouchableOpacity style={[styles.button, styles.buttoncria]} onPress={handleCadastrarFazenda}>
          <Text style={{fontWeight:'bold'}}>Adcicionar Fazenda</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );



};

export default Home;
