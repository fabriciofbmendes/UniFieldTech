import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,ScrollView, ImageBackground } from 'react-native';
import axios from 'axios';
import stilo from '../../styles';
import { getFazendasDoUsuario } from '../../api';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../routes/Stack/Models';
import styles from '../../styles';


const Home = () => {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const navigation = useNavigation<propsStack>();

  useEffect(() => {
    const fetchFazendas = async () => {
      try {
        const response = JSON.stringify(await getFazendasDoUsuario('abc'));
        console.log("Aqui:"+response);
        setFazendas(JSON.parse(response));
      } catch (error) {
        console.error('Erro ao obter fazendas:', error);
      }
    };

    fetchFazendas();
  }, []);

  const handleFazendaClick = (fazenda: Fazenda) => {
    // Navegar para a tela do mapa e passar os valores da fazenda
    navigation.navigate("Fazenda", {
      latitude: fazenda.latitude,
      longitude: fazenda.longitude,
      hectares: fazenda.hectares,
    });
  };

  return (
    <ScrollView>
      <View style={styles.home}>
      
        {fazendas.map((fazenda) => (
          <View style={styles.card}>
          <ImageBackground source={require('../img/fundo-login.jpg')} style={styles.fundocard}></ImageBackground>
          
            
            <TouchableOpacity
            style={[styles.button,styles.buttonhome]}
              key={fazenda.id}
              onPress={() => handleFazendaClick(fazenda)}
            >
              <Text>{fazenda.nome}</Text>
            </TouchableOpacity>
          
        </View>
        ))}
      
      </View>
    </ScrollView> 
  );
};

export default Home;
