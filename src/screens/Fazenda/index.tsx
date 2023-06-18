import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import axios from 'axios';

const ClimaRegiao = () => {
  const [temperaturaFazenda, setTemperaturaFazenda] = useState(null);
  const [temperaturasCidades, setTemperaturasCidades] = useState([]);

  const latitudeFazenda = -21.42370358340586;
  const longitudeFazenda = -45.954814513808884;

  useEffect(() => {
    const obterTemperaturaFazenda = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitudeFazenda}&longitude=${longitudeFazenda}`
        );
        const temperatura = response.data.current.temperature;
        setTemperaturaFazenda(temperatura);
      } catch (error) {
        console.error('Erro ao obter a temperatura da fazenda:', error);
      }
    };

    const obterTemperaturasCidades = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitudeFazenda}&longitude=${longitudeFazenda}&daily=temperature_2m_min,temperature_2m_max&limit=5`
        );
        const temperaturas = response.data.daily;
        setTemperaturasCidades(temperaturas);
      } catch (error) {
        console.error('Erro ao obter as temperaturas das cidades próximas:', error);
      }
    };

    obterTemperaturaFazenda();
    obterTemperaturasCidades();
  }, [latitudeFazenda, longitudeFazenda]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitudeFazenda,
          longitude: longitudeFazenda,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Circle
          center={{ latitude: latitudeFazenda, longitude: longitudeFazenda }}
          radius={100}
          fillColor="rgba(0, 128, 255, 0.2)"
          strokeColor="rgba(0, 128, 255, 0.8)"
          strokeWidth={2}
        />
      </MapView>

      <Text style={styles.temperature}>
        Temperatura da fazenda: {temperaturaFazenda}°C
      </Text>

      <Text style={styles.subheading}>Temperaturas das cidades próximas:</Text>
      {temperaturasCidades.map((temperatura, index) => (
        <Text key={index} style={styles.temperature}>
          Cidade {index + 1}: {temperatura}°C
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  temperature: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default ClimaRegiao;
