export interface temperaturas {
    clienteID: number;
    maxima : any;
    minima : any;
    atual : any;
    precipitation : any;
    porbabilidadePrecipitacao : any;
    nascersol : any;
    pordosol : any;
    indiceUV : any;
    indiceUVceuclaro : any;
    somaPrecipitacao : any;
    somaChuva : any;
    precipitationHours : Array<any>;
    precipitationProbabilityMax : any;
    rajadasMaxVento : any;
    direcaoDominanteVento : any;
    somaRadiacaoOndasCurtas : any;
    evapotranspiracaoReferência : any;
    temperature925hPa : any;
    relativeTemperature925hPa : any;
    cloudCover925hpa : any;
    windSpeed925hpa : any;
    windDirection925hpa : any;
}