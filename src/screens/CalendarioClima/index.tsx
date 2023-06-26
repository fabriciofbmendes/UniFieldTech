import React, { useEffect, useState } from "react";
import { View,Text, Button, TouchableOpacity } from "react-native";
import {getTemp} from "../../api";
import { useRoute } from "@react-navigation/native";
import { format } from 'date-fns';
import { ptBR,enUS, enGB } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';
import { VerificaClima } from "./validacoes";
import { ClimaInterface } from "../../interfaces/Clima";

const CalendarioClima = () => {
  const formato = 'dd';
  const route = useRoute();
  let { latitude, longitude, plantacaoId } = route.params as Calendario;
  latitude = parseFloat(latitude.toString());
  longitude = parseFloat(longitude.toString());
  plantacaoId = parseFloat(plantacaoId.toString());
  const [perigo,setPerigo] =  useState<perigo>(); 

    const [Clima, setClima] = useState<ClimaInterface>({}); 
      useEffect(() => {
        const obterTemperaturaFazenda = async () => {
            try {
            const response = await getTemp(longitude,latitude);
            await setClima(response);
            } catch (error) {
            console.log(error);
            }
        };
        obterTemperaturaFazenda();
        }, []);
        
    const handleTeste = async ()=>{
      const response = await VerificaClima(plantacaoId,Clima);
      setPerigo(response);
    }

    return (
        <View>
        {Clima.daily && Clima.daily.time && Clima.daily.time.map((time, index) => (
          <Text key={index}>
            {format(utcToZonedTime(time, 'America/Sao_Paulo'), formato, { locale: ptBR })}
            <Text>Chuva</Text>
            <Text>{perigo?.PerigoChuva[index]}</Text>
            <Text>Temperatura</Text>
            <Text>{perigo?.PerigoTemperatura[index]}</Text>
            <Text>Vento</Text>
            <Text>{perigo?.PerigoVento[index]}</Text>
          </Text>
        ))}

        <TouchableOpacity onPress={handleTeste}>
          <Text>Me Clique</Text>
        </TouchableOpacity>
      </View>
    )
}

export default CalendarioClima;