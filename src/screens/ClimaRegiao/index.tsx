import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const ClimaRegiao = () => {
  const route = useRoute();
  const [data, setData] = useState({});
  const [temperature, setTemperature] = useState(null);
  const [closestCities, setClosestCities] = useState([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&hourly=temperature_2m&current_weather=true&forecast_days=1&timezone=America%2FSao_Paulo`;

      try {
        const response = await axios.get(url);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching temperature:', error);
      }
    };

    // Chama a função fetchData inicialmente
    fetchData();

    // Chama a função fetchData novamente quando a localização é atualizada
  }, [location]);

  const handleLocationSubmit = () => {
    // Realiza alguma validação antes de atualizar a localização
    // e chamar fetchData novamente
    setLocation({ latitude: 0, longitude: 0 }); // Atualiza a localização com os valores corretos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Latitude: -21.4, Longitude: -45.95
      </Text>
      <View style={styles.temperatureContainer}>
        <Text style={styles.temperatureText}>{data.current_weather?.temperature}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Digite a localização"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.button} onPress={handleLocationSubmit}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  temperatureContainer: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    borderColor: 'black',
    marginBottom: 20,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClimaRegiao;
