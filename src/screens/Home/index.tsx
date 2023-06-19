import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,ScrollView, ImageBackground,Dimensions,StyleSheet,Image,SafeAreaView } from 'react-native';
import axios from 'axios';
import stilo from '../../styles';
import { getClima, getFazendasDoUsuario } from '../../api';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/Stack/Models';
import styles from '../../styles';
import { HumidadeAcimaDoSolo } from '../../interfaces/climApiVariables';
import moment from 'moment';
import { Row } from 'react-bootstrap';

const Home = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const navigation = useNavigation<propsStack>();
  const currentDate = moment().format('YYYY-MM-DD');
  const [clima, setClima] = useState<[]>([]);
  useEffect(() => {
    const fetchFazendas = async () => {
      try {
        const response = JSON.stringify(await getFazendasDoUsuario('abc'));
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
      hectares: fazenda.hectares,
    });
  };

  return (
    <ScrollView>
      
      <View style={styles.home}>
        <Text style={{fontSize:20,top:20}}>
          Minhas Fazendas
        </Text>
        {fazendas.map((fazenda:Fazenda) => (
          <View style={styles.card}>
          <ImageBackground imageStyle={{borderTopLeftRadius:20,borderTopRightRadius:20}} source={require('../img/fundo-login.jpg')} style={styles.fundocard}></ImageBackground>
          <Text style={{top:10,fontSize:20}}>{fazenda.nome}</Text>
          <View style={{flexDirection:'row',gap:30,top:10}}>
            <View style={{flexDirection:'column',top:20}}>
                <View style={styles.buttons}>
                  <TouchableOpacity
                  style={[styles.buttoninfo]}
                    key={fazenda.id}
                    onPress={() => handleFazendaClick(fazenda)}
                  >
                    <Text>Ver Região</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                  style={[styles.buttoninfo]}
                    key={fazenda.id}
                    onPress={() => handleFazendaClick(handleinformacoes)}
                  >
                    <Text>Saiba Mais</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
                <View style={{flexDirection:'column',width:'75%',gap:10,flexWrap:'wrap',paddingLeft:70}}>
                  <Text >Temperatura:80</Text>
                  <Text>Humidade:80</Text>
                  <Text>Temperatura:80</Text>
                  <Text>Humidade:80</Text>
                </View>
              </View>
        </View>
        ))}
      
      </View>
    </ScrollView>
  );
};

export default Home;
