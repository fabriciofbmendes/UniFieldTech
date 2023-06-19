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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,winddirection_10m,temperature_925hPa,relativehumidity_925hPa,windspeed_925hPa&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=America%2FSao_Paulo`;

    try {
      const response = await axios.get(url);
      setData(response.data);
      //console.log(response.data.daily);
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
  };

  const handleAddCity = (cityName: string) => {
    if (cityName) {
      getCity(cityName);
      const latitude = cityDetais.results[0].locations[0].latLng.lat; // Inserir lógica para obter latitude
      const longitude = cityDetais.results[0].locations[0].latLng.lng;
      getTemp(latitude, longitude);
      
      const newCity = {
        name: cityName,
        temperatura: data.current_weather.temperature, // Inserir lógica para obter temperatura
        VelVento: data.current_weather.windspeed,
        tempMax: calcularMedia(data.daily.temperature_2m_max),
        tempMin: calcularMedia(data.daily.temperature_2m_min), 
        precipitation : calcularMedia(data.daily.precipitation_probability_max),
      };     
      console.log(newCity);
      setCityList([...cityList, newCity]);
      setCity('');
    };
    
    
  };
  const calcularMedia = (array: number[]) => {

    if (!array || array.length === 0) {
      console.log("No");
      return 0; // Retorna 0 se o array estiver vazio ou não estiver definido
    }
  
    const soma = array.reduce((a, b) => a + b); // Calcula a soma dos valores
    const media = soma / array.length; // Calcula a média
  
    return media.toFixed(1); //
  };

  const renderCityItem = ({item } : any) => {
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.name}</Text>
        <Text>Temperatura Atual:  {item.temperatura}</Text>
        <Text>Temperatura Maxima: {item.tempMax}</Text>
        <Text>Temperatura Maxima: {item.tempMin}</Text>
        <Text>Precipitação:       {item.VelVento}</Text>
        <Text>Velocide do Vento:  {item.VelVento}</Text>
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
