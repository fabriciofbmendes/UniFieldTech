import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, FlatList, ScrollView, Alert } from 'react-native';
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
import { format } from 'date-fns';
interface Plantacao{
  plantacaoId :number;
}

type CityDetail = {
  name: string;
  temperatura: string;
  dias: string[];
  velVento: string;
  tempMax: string[];
  tempMin: string[];
  maxVento: string[];
  precipitation: string[];
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
    maxVento: [],	
    tempMax: [],
    tempMin: [],
    precipitation: [""],
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
        const longitude = cityDetail.long;
        await getTemp(latitude, longitude);
        cityDetail.temperatura = data.current_weather?.temperature || '';
        cityDetail.velVento = data.current_weather?.windspeed || '';
        cityDetail.maxVento = data.daily?.windspeed_10m_max || [];
        cityDetail.tempMax = data.daily?.temperature_2m_max || [];
        cityDetail.tempMin = data.daily?.temperature_2m_min || [];
        cityDetail.precipitation = data.daily?.precipitation_probability_max || [];
        cityDetail.dias = data.daily?.time || [],
        cityDetail.lat = dataCity.latLng?.lat || '';
        cityDetail.long = dataCity.latLng?.lng || '';
      }
      setCityList(updatedCityDetails);
      setCachedCityList(updatedCityDetails);
    }, 360 * 1000); 
  
    // Encerra o intervalo quando o componente for desmontado
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cityDetais]);
  
    // Encerra o intervalo quando o componente for desmontad

  /* useEffect(() => {
    
    const loadCachedCityList = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('cityDetails');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setCachedCityList(parsedData);
          setCityList(parsedData);
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
        }
      } catch (error) {
        console.error('Error loading cached city list:', error);
      }
    };
  
    loadCachedCityList();
  }, [cityDetais]); */
  

  const getTemp = async (latitude: string | undefined, longitude: string | undefined) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,winddirection_10m,temperature_925hPa,relativehumidity_925hPa,windspeed_925hPa&daily=temperature_2m_max,windspeed_10m_max,temperature_2m_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,precipitation_hours,precipitation_probability_max,winddirection_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&current_weather=true&timezone=America%2FSao_Paulo`;
    try {
      const response = await axios.get(url);
      setData(response.data);
      //console.log(response.data);
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
        maxVento : data.daily?.windspeed_10m_max || [], // Armazena todas as posições em uma string separada por vírgula
        dias : data.daily?.time || [], // Armazena todas as posições em uma string separada por vírgula
        tempMax: data.daily?.temperature_2m_max || [], // Armazena todas as posições em uma string separada por vírgula
        tempMin: data.daily?.temperature_2m_min || [], // Armazena todas as posições em uma string separada por vírgula
        precipitation: data.daily?.precipitation_probability_max || [], // Armazena todas as posições em uma string separada por vírgula
        lat: latitude,
        long: longitude,
      };
  
      //console.log(newCity);
      setCityList([...cityList, newCity]);
      await AsyncStorage.setItem('cityDetails', JSON.stringify([...cityList, newCity]));
      setCity('');

      const perigoResponse = await VerificaClima(plantacaoId, data);
      await setPerigo(perigoResponse);
    }
  };
  
  const calcularMedia = (array: number[]) => {

    if (!array || array.length === 0) {
      //console.log("No");
      return 0; // Retorna 0 se o array estiver vazio ou não estiver definido
    }
  
    const soma = array.reduce((a, b) => a + b); // Calcula a soma dos valores
    const media = soma / array.length; // Calcula a média
  
    return media.toFixed(1); //
  };

  const getColorByTemperature = (temperatureMAx:any , temperaturaMin:any) => {
    if (temperatureMAx > 38.0 || temperaturaMin <17.0) {
      return 'red'; // Define a cor como vermelha para temperaturas acima de 30°C
    } else if (temperatureMAx > 35.0 || temperaturaMin<20.0) {
      return '#EEAD2D'; // Define a cor como azul para temperaturas abaixo de 10°C
    }
      else{
        return 'green'
      }
  };

  const getColorByTemperatureMIN = (temperaturaMin:any) => {
    if (temperaturaMin <17.0) {
      return 'red'; // Define a cor como vermelha para temperaturas acima de 30°C
    } else if (temperaturaMin<20.0) {
      return '#EEAD2D'; // Define a cor como azul para temperaturas abaixo de 10°C
    }
      else{
        return 'green'
      }
  };
  
  const getColorByTemperatureMAX = (temperatureMAx:any) => {
    if (temperatureMAx > 38.0) {
      return 'red'; // Define a cor como vermelha para temperaturas acima de 30°C
    } else if (temperatureMAx > 35.0) {
      return '#EEAD2D'; // Define a cor como azul para temperaturas abaixo de 10°C
    }
      else{
        return 'green'
      }
  };

  const getColorByChuva = (precipitacao:any) => {
    if (precipitacao < 3 || precipitacao>7) {
      return 'red'; // Define a cor como vermelha para temperaturas acima de 30°C
    } else if (precipitacao < 4 || precipitacao > 6) {
      return '#EEAD2D'; // Define a cor como azul para temperaturas abaixo de 10°C
    }
      else{
        return 'green'
      }
  };

  const getColorByVento = (vento:any) => {
    if (vento < 40.0) {
      return 'green'; // Define a cor como vermelha para temperaturas acima de 30°C
    } else if (vento > 40.0 && vento <=50.0) {
      return '#EEAD2D'; // Define a cor como azul para temperaturas abaixo de 10°C
    }
      else{
        return 'red'
      }
  };
  
  const getdate = (data:any) => {
    try{
    return format(new Date(data),'dd-MM-yyyy')
  }
  catch{
    return data
  }
  };

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

  const renderCityItem = ({ item }: { item: CityDetail }) => {
    return (
      <View style={{ padding: 10,width:"100%" }}>
          <Text style={{textAlign:'center',fontSize:40,fontWeight:'bold'}} >{item.name}</Text>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,flexDirection:'column',flexWrap:'wrap',padding:10}}>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:7}}>
            <View style={estilllo.calendregion}>
              
                  <Text >{getdate(item.dias[0])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[0])}}>{item.tempMax[0]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[0])}}>{item.tempMin[0]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[0])}}>{item.precipitation[0]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[0])}}>{item.maxVento[0] }Km/h</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{getdate(item.dias[1])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[1])}}>{item.tempMax[1]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[1])}}>{item.tempMin[1]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[1])}}>{item.precipitation[1]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[1])}}>{item.maxVento[1]}Km/h</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{getdate(item.dias[2])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[2])}}>{item.tempMax[2]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[2])}}>{item.tempMin[2]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[2])}}>{item.precipitation[2]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[2])}}>{item.maxVento[2]}Km/h</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text >{getdate(item.dias[3])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[3])}}>{item.tempMax[3]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[3])}}>{item.tempMin[3]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[3])}}>{item.precipitation[3]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[3])}}>{item.maxVento[3]}Km/h</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{getdate(item.dias[4])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[4])}}>{item.tempMax[4]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[4])}}>{item.tempMin[4]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[4])}}>{item.precipitation[4]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[4])}}>{item.maxVento[4]}Km/h</Text>
                    </View>
                </View>
                <View style={estilllo.calendregion}>
                  <Text>{getdate(item.dias[5])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View >
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[5])}}>{item.tempMax[5]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[5])}}>{item.tempMin[5]}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[5])}}>{item.precipitation[5]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[5])}}>{item.maxVento[5]}Km/h</Text>
                    </View>
                </View>
                <View style={[estilllo.calendregion,{width:'31%',backgroundColor:'whites'}]}></View>
                <View style={estilllo.calendregion}>
                  <Text >{getdate(item.dias[6])}</Text>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /> 
                      <Text style={{color:getColorByTemperature(item.tempMax[0],item.tempMin[0])}}>{item.temperatura}C°</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-high" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMAX(item.tempMax[6])}}>{item.tempMax[6]}C°</Text>
                    </View>
                    
                    <View style={{flexDirection:'row'}}>
                      <FontAwesome5 name="temperature-low" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByTemperatureMIN(item.tempMin[6])}}>{item.tempMin[6]}C°</Text>
                    </View>
                    
                    <View style={{flexDirection:'row'}}>
                      <Ionicons name="rainy-outline" color="#000" size={18} style={estilllo.icons}></Ionicons><Text style={{color:getColorByChuva(item.precipitation[6])}}>{item.precipitation[6]}mm</Text>
                    </View> 
                    <View style={{flexDirection:'row'}}>
                    <Feather name="wind" size={18} color="black"  style={estilllo.icons} /><Text style={{color:getColorByVento(item.maxVento[6])}}>{item.maxVento[6]}Km/h</Text>
                    </View>
                </View>
                
            </View>
          </View>
        </View>
        </View>
     
    );
  };

  return ( 
  <ScrollView>
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
        <TouchableOpacity
        style={[styles.addButton,{flex:1,backgroundColor:'red',opacity:0.8}]}
        onPress={() => clearCityList()}
        ><Text style={[styles.buttonText]}>Limpar Cidades</Text>
        </TouchableOpacity>
      </View>
  </ScrollView>

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
