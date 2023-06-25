import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {getTemp} from "../../api";

const CalendarioClima = () => {
    const [Clima, setClima] = useState<{
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
          sunrise?: string[];
          sunset?: string[];
          uv_index_clear_sky?: string[];
          uv_index_max?: string[];
          precipitation_sum?: string[];
          rain_sum?: string[];
          precipitation_hours?: string[];
          windspeed_10m_max?: string[];
          windgusts_10m_max?: string[];
          winddirection_10m_dominant?: string[];
          // Outras propriedades relacionadas ao clima diário
        };

        hours?: {
            time?: string[];
            relativehumidity_2m?: string[];
            precipitation_probability?: string[];
            precipitation?: string[];
            rain?: string[];
            cloudcover?: string[];
            windspeed_10m?: string[];
            winddirection_10m?: string[];
            temperature_80m?: string[];
            uv_index?: string[];
            uv_index_clear_sky?: string[];
            temperature_925hPa?: string[];
            relativehumidity_925hPa?: string[];
            cloudcover_925hPa?: string[];
            windspeed_925hPa?: string[];
            winddirection_925hPa?: string[];
        }
      }>({}); 
      
      useEffect(() => {
        const obterTemperaturaFazenda = async () => {
            const longitude = -47.9292;
            const latitude = -15.7795;
            try {
            const response = await getTemp(longitude,latitude);
            //console.log(response);
            setClima(response);
            console.log(Clima);
            } catch (error) {
            console.log(error);
            }
        };
        obterTemperaturaFazenda();
        }, []);
    
    return (
        <View>
            
        </View>
    )
}

export default CalendarioClima;