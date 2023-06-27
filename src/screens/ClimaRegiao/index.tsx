import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, FlatList } from 'react-native';
import axios from 'axios';
import estilo from '../../styles'
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CityDetail = {
  name: string;
  temperatura: string;
  dias: string;
  velVento: string;
  tempMax: string;
  tempMin: string;
  precipitation: string;
  lat: string | undefined;
  long: string | undefined;
};  
type tempoDia = {
  dia : string;
  temperaturaMax: string;
  temperaturaMin: string;
  probabilidadeChuva: string,
};

const ClimaRegiao = () => {
  const route = useRoute();
  const [data, setData] = useState<{
    current_weather?: {
      temperature?: string;
      windspeed?: string;
      // Outras propriedades relacionadas ao clima atual
    };
    daily?: {
      time?: string[];
      temperature_2m_max?: string[];
      temperature_2m_min?: string[];
      precipitation_probability_max?: string[];
      // Outras propriedades relacionadas ao clima diário
    };
  }>({});

  const [tempoDia, setTempoDia] = useState<tempoDia>({
    dia: "",
    temperaturaMax: "",
    temperaturaMin: "",
    probabilidadeChuva: "",
  });
  
  const [dataCity, setDataCity] = useState<{

    latLng?: {
      lat?: string;
      lng?: string;
    }
  }>({});


  const [cityDetais, setCityDetais] = useState<CityDetail>({
    name: "",
    dias: "",
    temperatura: "",
    velVento: "",
    tempMax: "",
    tempMin: "",
    precipitation: "",
    lat: "",
    long: ""
  });
  const [cachedCityList, setCachedCityList] = useState<CityDetail[]>([]);
  const [city, setCity] = useState('');
  const [cityList, setCityList] = useState<CityDetail[]>([]);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  useEffect(() => {
    // Inicia o intervalo de atualização a cada um minuto (60 segundos)
    const id = setInterval(async () => {
      const updatedCityDetails = [...cityList];
      for (let i = 0; i < updatedCityDetails.length; i++) {
        const cityDetail = updatedCityDetails[i];
        const latitude = cityDetail.lat;
        const longitude = String(cityDetail.long);
        await getTemp(latitude, longitude);
      }
      setCityList(updatedCityDetails);
      setCachedCityList(updatedCityDetails);
    }, 60 * 1000); 
  
    // Encerra o intervalo quando o componente for desmontado
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cityDetais]);

  useEffect(() => {
    const loadCachedCityList = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('cityDetails');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setCachedCityList(parsedData);
          setCityList(parsedData);
        }
      } catch (error) {
        console.error('Error loading cached city list:', error);
      }
    };
  
    loadCachedCityList();
  }, []);
  

  const getTemp = async (latitude: string | undefined, longitude: string | undefined) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,winddirection_10m,temperature_925hPa,relativehumidity_925hPa,windspeed_925hPa&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=America%2FSao_Paulo`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching temperature:', error);
    }
  };

  const getCity = async (city: string) => {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=nQqONaeF5h2qylUmCjdyjH4wDeTLElmW&location=${city}`;
    try {
      const response = await axios.get(url);
      
      setDataCity(response.data.results[0].locations[0]);
      console.log(response.data.results[0]);
    } catch (error) {
      console.error('Error fetching City:', error);
    }
  };

  const handleAddCity = async (cityName: string) => {
    if (cityName) {
      await getCity(cityName);
      const latitude = dataCity.latLng?.lat;
      const longitude = dataCity.latLng?.lng;
      await getTemp(latitude, longitude);
  
      const newCity: CityDetail = {
        name: cityName,
        temperatura: data.current_weather?.temperature || "",
        velVento: data.current_weather?.windspeed || "",
        
        dias : data.daily?.time?.join(";") || "",
        tempMax: data.daily?.temperature_2m_max?.join("; ") || "", // Armazena todas as posições em uma string separada por vírgula
        tempMin: data.daily?.temperature_2m_min?.join("; ") || "", // Armazena todas as posições em uma string separada por vírgula
        precipitation: data.daily?.precipitation_probability_max?.join("; ") || "", // Armazena todas as posições em uma string separada por vírgula
        lat: latitude,
        long: longitude,
      };
  
      console.log(newCity);
      setCityList([...cityList, newCity]);
      await AsyncStorage.setItem('cityDetails', JSON.stringify([...cityList, newCity]));
      setCity('');
    }
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

  const renderCityItem = ({ item }: { item: CityDetail }) => {
    return (
      <View style={{ padding: 10,width:"100%" }}>
        <View style={{width:"100%",alignItems:'center',borderWidth:1}}>
          <Text>{item.name}</Text>
        </View>
        <View style={{flexDirection:'row',flexWrap:'wrap',borderWidth:1}}>
          <Text>Temperatura Atual: {item.temperatura}C°</Text>
          <Text>Dias: {item.dias}</Text>
          <Text>Temperatura Máxima: {item.tempMax}</Text>
          <Text>Temperatura Mínima: {item.tempMin}</Text>
          <Text>Precipitação: {item.precipitation}</Text>
          <Text>Velocidade do Vento: {item.velVento}</Text>
        </View>
      </View>
    );
  };

  return ( 
  <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.headerText}>Lista de Cidades</Text>
        <View style={{flexDirection:'row',gap:10,alignItems:'center',justifyContent:'center'}}>
          <TextInput
            style={[estilo.input,{width:"60%"}]}
            placeholder="Insira o nome da cidade"
            onChangeText={text => setCity(text)}
            value={city}
          />
          <TouchableOpacity
            style={[styles.addButton,{flex:1}]}
            onPress={() => handleAddCity(city)}
          >
            <Text style={styles.buttonText}>Adicionar</Text>
          </TouchableOpacity>
      </View>

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
    backgroundColor: 'blue',
    paddingVertical: 10,
    alignItems:'center',
    borderRadius: 8,
    bottom:5,
    marginLeft:10,
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
    alignSelf:'center',
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
