import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const ClimaRegiao = () => {
  const route = useRoute();
  const [data, setData] = useState({});
  const [cityDetais, setCityDetais] = useState({});
  const [location, setLocation] = useState('');

  const [city, setCity] = useState('');
  const [cityList, setCityList] = useState([]);

  const getTemp = async (latitude : string, longitude : string) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&forecast_days=1&timezone=America%2FSao_Paulo`;

    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log(response.data.current_weather);
    } catch (error) {
      console.error('Error fetching temperature:', error);
    }
  };

  const getCity = async (city: string) => {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=nQqONaeF5h2qylUmCjdyjH4wDeTLElmW&location=${city}`;
    try {
      const response = await axios.get(url);
      setCityDetais(response.data);
      //console.log(response.data.results[0].locations[0].latLng);
    } catch (error) {
      console.error('Error fetchinfg City:', error);
    }
  }

  const handleAddCity = (cityName: string) => {
    if (cityName) {
      getCity(cityName);
      getTemp(cityDetais.results[0].locations[0].latLng.lat,cityDetais.results[0].locations[0].latLng.lng);
      
      const newCity = {
        name: cityName,
        latitude: cityDetais.results[0].locations[0].latLng.lat, // Inserir lógica para obter latitude
        longitude: cityDetais.results[0].locations[0].latLng.lng, // Inserir lógica para obter longitude
        temperatura: data.current_weather.temperature, // Inserir lógica para obter temperatura
      };
      console.log(newCity);
      setCityList([...cityList, newCity]);
      setCity('');
    }
  };

  const renderCityItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.name}</Text>
        <Text>Latitude: {item.latitude}</Text>
        <Text>Longitude: {item.longitude}</Text>
        <Text>Temperatura: {item.temperatura}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          query={{
            key: `AIzaSyCelaOIk2vZZiqnUm9-M_x5Vt8BQcyf2jE`,
            language: 'pt', // language of the results
          }}
          onPress={(data, details) => handleAddCity(data.description)}
          onFail={(error) => console.error(error)}
          requestUrl={{
            url:
              'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
            useOnPlatform: 'web',
          }}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddCity(city)}
        >
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.headerText}>Lista de Cidades</Text>

      <TextInput
        style={styles.input}
        placeholder="Insira o nome da cidade"
        onChangeText={text => setCity(text)}
        value={city}
      />

      <FlatList
        data={cityList}
        renderItem={renderCityItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginLeft: 10,
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  flatList: {
    marginTop: 20,
  },
});

export default ClimaRegiao;
