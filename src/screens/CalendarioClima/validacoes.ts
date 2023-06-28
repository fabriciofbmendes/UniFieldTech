import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClimaInterface } from '../../interfaces/Clima';
let TokenAutorizado: string | null;
const API_URL = 'http://192.168.1.3:5141';
let PerigoVento: string[] = [];
let PerigoTemperatura: string[] = [];
let PerigoChuva: string[] = [];
let ClimaValidacao : ClimaInterface;

export const VerificaClima = async (plantacaoId : number,Clima : ClimaInterface) => {
    try {
        ClimaValidacao = Clima;
        TokenAutorizado = await AsyncStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/api/Fazenda/plantacao/${plantacaoId}`, {
          headers: {
            Authorization: `Bearer ${TokenAutorizado}`,
            Accept: 'application/json'
          },
        });
        await VerificaVento(response.data);
        await VerificaTemperatura(response.data);
        await VerificaChuva(response.data);
        let Perigos = {PerigoVento,PerigoTemperatura,PerigoChuva};
        return Perigos;
    }
    catch (error) {
        //console.log(error);
    }
}
const VerificaVento = async (response:string) => {
        switch(response.toLowerCase()) {
            case "arroz":
                for(let i = 0;i < 7; i++){
                    const windspeedMax = ClimaValidacao.daily?.windspeed_10m_max?.[i] || '0';
                    if (parseFloat(windspeedMax) < 40.0) {
                        PerigoVento[i] = "verde";
                        //console.log("PerigoVento:" + PerigoVento[i]);
                    }
                    else if (parseFloat(windspeedMax) > 40.0 && parseFloat(windspeedMax) <= 50.0) {
                        PerigoVento[i] = "amarelo";
                    }
                    else {
                        PerigoVento[i] = "vermelho";
                    }
                }
                break;
            case "soja":
                for(let i = 0;i < 7; i++){
                    const windspeedMax = ClimaValidacao.daily?.windspeed_10m_max?.[i] || '0';
                    if (parseFloat(windspeedMax) < 40.0) {
                        PerigoVento[i] = "verde";
                    }
                    else if (parseFloat(windspeedMax) > 40.0 && parseFloat(windspeedMax) <= 50.0) {
                        PerigoVento[i] = "amarelo";
                    }
                    else {
                        PerigoVento[i] = "vermelho";
                    }
                }
                break;
            case "milho":
                for(let i = 0;i < 7; i++){
                    const windspeedMax = ClimaValidacao.daily?.windspeed_10m_max?.[i] || '0';
                    if (parseFloat(windspeedMax) < 60.0) {
                        PerigoVento[i] = "verde";
                    }
                    else if (parseFloat(windspeedMax) > 60.0 && parseFloat(windspeedMax) <= 70.0) {
                        PerigoVento[i] = "amarelo";
                    }
                    else {
                        PerigoVento[i] = "vermelho";
                    }
                }
                break;
            case "trigo":
                for(let i = 0;i < 7; i++){
                    const windspeedMax = ClimaValidacao.daily?.windspeed_10m_max?.[i] || '0';
                    if (parseFloat(windspeedMax) < 60.0) {
                        PerigoVento[i] = "verde";
                    }
                    else if (parseFloat(windspeedMax) > 60.0 && parseFloat(windspeedMax) <= 70.0) {
                        PerigoVento[i] = "amarelo";
                    }
                    else {
                        PerigoVento[i] = "vermelho";
                    }
                }
                break;
            case "feijao":
                for(let i = 0;i < 7; i++){
                    const windspeedMax = ClimaValidacao.daily?.windspeed_10m_max?.[i] || '0';
                    if (parseFloat(windspeedMax) < 60.0) {
                        PerigoVento[i] = "verde";
                    }
                    else if (parseFloat(windspeedMax) > 60.0 && parseFloat(windspeedMax) <= 70.0) {
                        PerigoVento[i] = "amarelo";
                    }
                    else {
                        PerigoVento[i] = "vermelho";
                    }
                }
                break;
        }
}

const VerificaTemperatura = async (response:string) => {
    switch(response.toLowerCase()) {
        case "arroz":
            for(let i = 0;i < 7; i++){
                const tempMax = ClimaValidacao.daily?.temperature_2m_max?.[i] || '0';
                const tempMin = ClimaValidacao.daily?.temperature_2m_min?.[i] || '0';
                if (parseFloat(tempMax) > 38.0 || parseFloat(tempMin) < 17.0) {
                    PerigoTemperatura[i] = "vermelho";
                }
                else if (parseFloat(tempMax) > 35.0 || parseFloat(tempMin) < 20.0) {
                    PerigoTemperatura[i] = "amarelo";
                }
                else {
                    PerigoTemperatura[i] = "verde";
                }
            }
            break;
        case "soja":
            for(let i = 0;i < 7; i++){
                const tempMax = ClimaValidacao.daily?.temperature_2m_max?.[i] || '0';
                const tempMin = ClimaValidacao.daily?.temperature_2m_min?.[i] || '0';
                if (parseFloat(tempMax) > 33.0 || parseFloat(tempMin) < 17.0) {
                    PerigoTemperatura[i] = "vermelho";
                }
                else if (parseFloat(tempMax) > 30.0 || parseFloat(tempMin) < 20.0) {
                    PerigoTemperatura[i] = "amarelo";
                }
                else {
                    PerigoTemperatura[i] = "verde";
                }
            }
            break;
        case "milho":
            for(let i = 0;i < 7; i++){
                const tempMax = ClimaValidacao.daily?.temperature_2m_max?.[i] || '0';
                const tempMin = ClimaValidacao.daily?.temperature_2m_min?.[i] || '0';
                if (parseFloat(tempMax) > 33.0 || parseFloat(tempMin) < 20.0) {
                    PerigoTemperatura[i] = "vermelho";
                }
                else if (parseFloat(tempMax) > 30.0 || parseFloat(tempMin) < 24.0) {
                    PerigoTemperatura[i] = "amarelo";
                }
                else {
                    PerigoTemperatura[i] = "verde";
                }
            }
            
            break;
        case "trigo":
            for(let i = 0;i < 7; i++){
                const tempMax = ClimaValidacao.daily?.temperature_2m_max?.[i] || '0';
                const tempMin = ClimaValidacao.daily?.temperature_2m_min?.[i] || '0';
                if (parseFloat(tempMax) > 26.0 || parseFloat(tempMin) < 12.0) {
                    PerigoTemperatura[i] = "vermelho";
                }
                else if (parseFloat(tempMax) > 20.0 || parseFloat(tempMin) < 15.0) {
                    PerigoTemperatura[i] = "amarelo";
                }
                else {
                    PerigoTemperatura[i] = "verde";
                }
            }
            break;
        case "feijao":
            for(let i = 0;i < 7; i++){
                const tempMax = ClimaValidacao.daily?.temperature_2m_max?.[i] || '0';
                const tempMin = ClimaValidacao.daily?.temperature_2m_min?.[i] || '0';
                if (parseFloat(tempMax) > 28.0 || parseFloat(tempMin) < 14.0) {
                    PerigoTemperatura[i] = "vermelho";
                }
                else if (parseFloat(tempMax) > 24.0 || parseFloat(tempMin) < 18.0) {
                    PerigoTemperatura[i] = "amarelo";
                }
                else {
                    PerigoTemperatura[i] = "verde";
                }
            }
            break;
    }
}

const VerificaChuva = async (response:string) => {
    switch(response.toLowerCase()) {
        case "arroz":
            for(let i = 0;i < 7; i++){
                const precipitacaoDia = ClimaValidacao.daily?.precipitation_sum?.[i] || '0';
                if (parseFloat(precipitacaoDia) < 3  || parseFloat(precipitacaoDia) > 7) {
                    PerigoChuva[i] = "vermelho";
                }
                else  if (parseFloat(precipitacaoDia) < 4  || parseFloat(precipitacaoDia) > 6) {
                    PerigoChuva[i] = "amarelo";
                }
                else {
                    PerigoChuva[i] = "verde";
                }
            }
            break;
        case "soja":
            for(let i = 0;i < 7; i++){
                const precipitacaoDia = ClimaValidacao.daily?.precipitation_sum?.[i] || '0';
                if (parseFloat(precipitacaoDia) < 3  || parseFloat(precipitacaoDia) > 7) {
                    PerigoChuva[i] = "vermelho";
                }
                else  if (parseFloat(precipitacaoDia) < 4  || parseFloat(precipitacaoDia) > 6) {
                    PerigoChuva[i] = "amarelo";
                }
                else {
                    PerigoChuva[i] = "verde";
                }
            }
            break;
        case "milho":
            for(let i = 0;i < 7; i++){
                const precipitacaoDia = ClimaValidacao.daily?.precipitation_sum?.[i] || '0';
                if (parseFloat(precipitacaoDia) < 3  || parseFloat(precipitacaoDia) > 7) {
                    PerigoChuva[i] = "vermelho";
                }
                else  if (parseFloat(precipitacaoDia) < 4  || parseFloat(precipitacaoDia) > 6) {
                    PerigoChuva[i] = "amarelo";
                }
                else {
                    PerigoChuva[i] = "verde";
                }
            }
            break;
        case "trigo":
            for(let i = 0;i < 7; i++){
                const precipitacaoDia = ClimaValidacao.daily?.precipitation_sum?.[i] || '0';
                if (parseFloat(precipitacaoDia) < 3  || parseFloat(precipitacaoDia) > 7) {
                    PerigoChuva[i] = "vermelho";
                }
                else  if (parseFloat(precipitacaoDia) < 4  || parseFloat(precipitacaoDia) > 6) {
                    PerigoChuva[i] = "amarelo";
                }
                else {
                    PerigoChuva[i] = "verde";
                }
            }
            break;
        case "feijao":
            for(let i = 0;i < 7; i++){
            const precipitacaoDia = ClimaValidacao.daily?.precipitation_sum?.[i] || '0';
            if (parseFloat(precipitacaoDia) < 3  || parseFloat(precipitacaoDia) > 7) {
                PerigoChuva[i] = "vermelho";
            }
            else  if (parseFloat(precipitacaoDia) < 4  || parseFloat(precipitacaoDia) > 6) {
                PerigoChuva[i] = "amarelo";
            }
            else {
                PerigoChuva[i] = "verde";
            }
        }
        break;
    }
}