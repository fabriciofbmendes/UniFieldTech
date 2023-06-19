import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const ClimaRegiao = () => {
  const [temperaturaFazenda, setTemperaturaFazenda] = useState(null);
  const [temperaturasCidades, setTemperaturasCidades] = useState([]);

  const route = useRoute();
  let { latitude, longitude, hectar } = route.params as FazendaMapa;

  latitude = parseFloat(latitude.toString());
  longitude = parseFloat(longitude.toString());

  useEffect(() => {
    const obterTemperaturaFazenda = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}`
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
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min,temperature_2m_max&limit=5`
        );
        const temperaturas = response.data.daily;
        setTemperaturasCidades(temperaturas);
      } catch (error) {
        console.error('Erro ao obter as temperaturas das cidades próximas:', error);
      }
    };

    obterTemperaturaFazenda();
    obterTemperaturasCidades();
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Circle
          center={{ latitude: latitude, longitude: longitude }}
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
