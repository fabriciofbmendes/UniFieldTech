import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, FlatList,Alert } from 'react-native';
import axios from 'axios';
import estilo from '../../styles'
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VerificaClima} from '../CalendarioClima/validacoes'
import { ClimaInterface } from '../../interfaces/Clima';
import getOverlappingDaysInIntervals from 'date-fns/fp/getOverlappingDaysInIntervals/index';
import { Row } from 'react-bootstrap';
import { FontAwesome5 } from '@expo/vector-icons';
import estilllo from '../../styles';
import { Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'; 
import moment from 'moment';
interface Plantacao{
  plantacaoId :number;
}

type CityDetail = {
  name: string;
  temperatura: string;
  dias: string[];
  velVento: string;
  maxVento: string[];
  tempMax: string[];
  tempMin: string[];
  precipitation: string[];
  sumChuva: string[];
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
  let { plantacaoId } = route.params as Plantacao;
  const [perigo,setPerigo] =  useState<perigo>(); 
  // const [data, setData] = useState<{
  //   current_weather?: {
  //     temperature?: string;
  //     windspeed?: string;
  //     // Outras propriedades relacionadas ao clima atual
  //   };
  //   daily?: {
  //     time?: string[];
  //     temperature_2m_max?: string[];
  //     temperature_2m_min?: string[];
  //     precipitation_probability_max?: string[];
  //     // Outras propriedades relacionadas ao clima diário
  //   };
  // }>({});

  const [data, setData] = useState<ClimaInterface>({});


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
    dias: [],
    temperatura: "",
    velVento: "",	
    maxVento:[],
    tempMax: [],
    tempMin: [],
    precipitation: [""],
    sumChuva: [""],
    lat: "",
    long: ""
  });
  const [cachedCityList, setCachedCityList] = useState<CityDetail[]>([]);
  const [city, setCity] = useState('');
  const [cityList, setCityList] = useState<CityDetail[]>([]);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  /* useEffect(() => {
    // Inicia o intervalo de atualização a cada um minuto (60 segundos)
    const id = setInterval(async () => {
      const updatedCityDetails = [...cityList];
      for (let i = 0; i < updatedCityDetails.length; i++) {
        const cityDetail = updatedCityDetails[i];
        const latitude = cityDetail.lat;
        const longitude = cityDetail.long;
        await getTemp(latitude, longitude);
        cityDetail.temperatura = data.current_weather?.temperature || '';
        cityDetail.velVento = data.current_weather?.windspeed || '';
        cityDetail.tempMax = data.daily?.temperature_2m_max || [];
        cityDetail.tempMin = data.daily?.temperature_2m_min || [];
        cityDetail.precipitation = data.daily?.precipitation_probability_max || [];
        cityDetail.dias = data.daily?.time || [],
      
        cityDetail.lat = dataCity.latLng?.lat || '';
        cityDetail.long = dataCity.latLng?.lng || '';
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
  }, [cityDetais]); */
  
    // Encerra o intervalo quando o componente for desmontad

  useEffect(() => {
    const loadCachedCityList = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('cityDetails');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setCachedCityList(parsedData);
          setCityList(parsedData);
        }
        const updatedCityDetails = [...cityList];
        for (let i = 0; i < updatedCityDetails.length; i++) {
          const cityDetail = updatedCityDetails[i];
          const latitude = cityDetail.lat;
          const longitude = cityDetail.long;
          await getTemp(latitude, longitude);
          cityDetail.temperatura = data.current_weather?.temperature || '';
          cityDetail.velVento = data.current_weather?.windspeed || '';
          cityDetail.tempMax = data.daily?.temperature_2m_max || [];
          cityDetail.tempMin = data.daily?.temperature_2m_min || [];
          cityDetail.precipitation = data.daily?.precipitation_probability_max || [];
          cityDetail.dias = data.daily?.time || [],
        
          cityDetail.lat = dataCity.latLng?.lat || '';
          cityDetail.long = dataCity.latLng?.lng || '';
        }
        setCityList(updatedCityDetails);
        setCachedCityList(updatedCityDetails);
      } catch (error) {
        console.error('Error loading cached city list:', error);
      }
    };
  
    loadCachedCityList();
  }, []);
  
  const clearCityList = async () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza de que deseja remover todas as cidades?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: async () => {
          setCityList([]); // Limpa a lista de cidades
          setCachedCityList([]); // Limpa a lista de cidades em cache
          await AsyncStorage.removeItem('cityDetails'); // Remove os dados do cache

        } },
      ],
      { cancelable: false }
    );
    
  };
  
  const getTemp = async (latitude: string | undefined, longitude: string | undefined) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,winddirection_10m,temperature_925hPa,relativehumidity_925hPa,windspeed_925hPa&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=America%2FSao_Paulo`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      //console.log(response.data.daily);
    } catch (error) {
      
    }
  };

  const getCity = async (city: string) => {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=nQqONaeF5h2qylUmCjdyjH4wDeTLElmW&location=${city}`;
    try {
      const response = await axios.get(url);
      
      setDataCity(response.data.results[0].locations[0]);
      //console.log(response.data.results[0]);
    } catch (error) {
      
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
        dias : data.daily?.time || [], // Armazena todas as posições em uma string separada por vírgula
        maxVento: data.daily?.windspeed_10m_max || [],
        tempMax: data.daily?.temperature_2m_max || [], // Armazena todas as posições em uma string separada por vírgula
        tempMin: data.daily?.temperature_2m_min || [], // Armazena todas as posições em uma string separada por vírgula
        precipitation: data.daily?.precipitation_probability_max || [], // Armazena todas as posições em uma string separada por vírgula
        sumChuva : data.daily?.precipitation_sum || [],
        lat: latitude,
        long: longitude,
      };
      //console.log(newCity);
      newCity.dias.forEach((dia: string) => {
        dia = moment(dia).format('DD/MM');
      });
      setCityList([...cityList, newCity]);
      await AsyncStorage.setItem('cityDetails', JSON.stringify([...cityList, newCity]));
      setCity('');

      const perigoResponse = await VerificaClima(plantacaoId, data);
      await setPerigo(perigoResponse);
    }
  };

  const renderCityItem = ({ item }: { item: CityDetail }) => {
    return (
      <View style={{ padding: 10,width:"100%" }}>
          <Text style={{textAlign:'center',fontSize:40,fontWeight:'bold'}} >{item.name}</Text>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,flexDirection:'column',flexWrap:'wrap',padding:10}}>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>
            <View style={estilllo.calendregion}>
              
                  <Text>{moment(item.dias[0]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[0]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[0]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[0]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[0]}</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{moment(item.dias[1]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[1]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[1]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[1]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[1]}</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{moment(item.dias[2]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[2]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[2]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[2]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[2]}</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{moment(item.dias[3]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[3]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[3]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[3]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[3]}</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{moment(item.dias[4]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[4]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[4]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[4]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[4]}</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{moment(item.dias[5]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[5]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[5]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[5]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[5]}</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{moment(item.dias[6]).format('DD/MM')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMax[6]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text>{item.tempMin[6]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text>{item.precipitation[6]}%</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text>{item.maxVento[6]}</Text>
                    </View>
                </View>
            </View>
          </View>

        </View>
        </View>
     
    );
  };
  //AIzaSyCelaOIk2vZZiqnUm9-M_x5Vt8BQcyf2jE
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.headerText}>Lista de Cidades</Text>
      <View style={styles.container}>
      <View style={estilo.input}>
        <TextInput
          style={styles.textInput}
          placeholder="Digite o nome da cidade"
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <GooglePlacesAutocomplete
          placeholder="Pesquisar"
          onPress={(data, details) => setCity(data.description)}
          query={{
            key: 'AIzaSyCelaOIk2vZZiqnUm9-M_x5Vt8BQcyf2jE',
            language: 'pt', 
          }}
          requestUrl={{
            url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
            useOnPlatform: 'web',
          }}
          styles={{
            textInputContainer: { display: 'none' },
          }}
        />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => handleAddCity(city)}>
        <Ionicons name="add-circle" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.addButton, { }]}
        onPress={clearCityList}
      >
        <Ionicons name="trash-bin" size={24} color="red" />
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
  
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  addButton: {
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
