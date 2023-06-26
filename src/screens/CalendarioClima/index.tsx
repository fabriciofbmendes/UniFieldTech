import React, { useEffect, useState } from "react";
import { View,Text, Button,Modal, TouchableOpacity, ScrollView, Pressable } from "react-native";
import {getTemp} from "../../api";
import { useRoute } from "@react-navigation/native";
import { format } from 'date-fns';
import { ptBR,enUS, enGB } from 'date-fns/locale';
import { utcToZonedTime } from 'date-fns-tz';
import { VerificaClima } from "./validacoes";
import { ClimaInterface } from "../../interfaces/Clima";
import styles from "../../styles";

const CalendarioClima = () => {
  const formato = 'EEE';
  const route = useRoute();
  let { latitude, longitude, plantacaoId } = route.params as Calendario;
  latitude = parseFloat(latitude.toString());
  longitude = parseFloat(longitude.toString());
  plantacaoId = parseFloat(plantacaoId.toString());
  const [perigo,setPerigo] =  useState<perigo>(); 
  const [modalVisible, setModalVisible] = useState(false);

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
    
        
      const getTextColorVento = (index : number) => {
        const valorVento = perigo?.PerigoVento[index];
        if (valorVento === 'vermelho') {
          return 'red';
        } else if (valorVento === 'verde') {
          return 'green';
        } else if (valorVento === 'amarelo') {
          return 'yellow';
        }
      };
      const getTextColorChuva = (index : number) => {
        const valorChuva = perigo?.PerigoChuva[index];
        if (valorChuva === 'vermelho') {
          return 'red';
        } else if (valorChuva === 'verde') {
          return 'green';
        } else if (valorChuva === 'amarelo') {
          return 'yellow';
        }
      };

      const getTextColortemperatura = (index : number) => {
        const valortemperatura = perigo?.PerigoTemperatura[index];
        if (valortemperatura === 'vermelho') {
          return 'red';
        } else if (valortemperatura === 'verde') {
          return 'green';
        } else if (valortemperatura === 'amarelo') {
          return 'yellow';
        }
      };    

    return (
      <>
      
            <Text style={{fontSize:24,textAlign:'center',top:'2%'}}>Nome da Fazenda</Text>
          <View style={styles.calendario}>
            
          {Clima.daily && Clima.daily.time && Clima.daily.time.map((time, index) => (
            <Text key={index}>
              
              <View style={{display:"flex",flexDirection:'row'}}>
                <View style={styles.itemcalendario}>
                 
                  <Text style={{fontSize:15,textTransform:'uppercase',fontWeight:'bold'}}>{format(utcToZonedTime(time, 'America/Sao_Paulo'), formato, { locale: ptBR })}</Text>
                  <View style={styles.doubleitem}>
                    <Text >Chuva: </Text>
                    <Text style={{color: getTextColorChuva(index)}}>{perigo?.PerigoChuva[index]}</Text>
                  </View>
                 
                  <View style={styles.doubleitem}>
                    <Text>Vento: </Text>
                    <Text style={{color: getTextColorVento(index)}}>{perigo?.PerigoVento[index]}</Text>
                  </View>
                  <View style={styles.doubleitem}>
                    <Text>Temperatura: </Text>
                    <Text style={{color: getTextColortemperatura(index)}}>{perigo?.PerigoTemperatura[index]}</Text>
                  </View>

                </View>
              </View>
            </Text>
          ))}

          <TouchableOpacity onPress={handleTeste}>
            <Text style={[styles.button,{left:22,top:20,paddingTop:15,justifyContent:'center',width:'200%'}]}>Me Clique</Text>
          </TouchableOpacity>
        </View>
        
        </>
    )
}

export default CalendarioClima;