import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const ClimaRegiao = () => {
  const route = useRoute();
  const [data,setData] = useState({});
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {

    const url = `https://api.open-meteo.com/v1/forecast?latitude=-21.45&longitude=-45.95&hourly=temperature_2m&current_weather=true&forecast_days=1&timezone=America%2FSao_Paulo`;
    const fetchTemperature = async () => {
      try {
        axios.get(url).then((response) => {
          setData(response.data)
          console.log(response.data)
        });
      } catch (error) {
        console.error('Error fetching temperature:', error);
      }
    };

    fetchTemperature();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Latitude: {-21.4}, Longitude: {-45.95}
      </Text>
        <Text style={styles.text}>{data.hourly.temperature_2m}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ClimaRegiao;
