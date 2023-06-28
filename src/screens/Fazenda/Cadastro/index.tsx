import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/Stack/Models';
import { cadastrarFazenda, getCoordinates, getUserId,PupularDropdownPlantacao } from '../../../api';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';

interface Estado {
    label: string;
    value: string;
  }
  
  interface Plantio{
  nomePlantio: string;
  id: number;
}

  interface IdUsuario{
    clienteID : number;
    clienteIdUser: string;
  }

const CadastroFazenda = () => {
  const [nomeFazenda, setNomeFazenda] = useState('');
  const [hectar, setHectar] = useState('');
  const [PlantacaoId, setCultivar] = useState<number>(0);
  const [plantios, setPlantios] = useState<Plantio[]>([]);
  const [rua, setRua] = useState('');
  const [num, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [estadosBrasileiros, setEstadosBrasileiros] = useState<Estado[]>([
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'São Paulo', value: 'SP' },
  ]);
  
  useEffect(() => {
    const fetchPlantios = async () => {
      try {
        const response = await PupularDropdownPlantacao();
        setPlantios(response);
      } catch (error) {
        //console.error('Erro ao obter plantios:', error);
      }
    };

    fetchPlantios();
  }, []);

  const plantioItems: ItemType<number>[] = plantios.map((plantio) => ({
    label: plantio.nomePlantio,
    value: plantio.id,
  }));

  const navigation = useNavigation<propsStack>();
  
  const handleCadastroFazenda = async () => {

    const ids : IdUsuario= await getUserId();

    const fazenda = {
        fazendaID: 0,
        nomeFazenda,
        hectar,
        PlantacaoId,
        rua,
        num,
        cidade,
        estado,
        latitude: '',
        longitude: '',
        tipoPlantio: true,
        areaMecanizada: true,
        clienteIdUser: ids.clienteIdUser,
        clienteID: ids.clienteID
    };
    try {
        const coordinates = await getCoordinates(`${rua}, ${num}, ${cidade}, ${estado}`);
        fazenda.latitude = coordinates.latitude;
        fazenda.longitude = coordinates.longitude;
      } catch (error) {
        ////console.error('Erro ao buscar as coordenadas:', error);
      }
      
    try {
      await cadastrarFazenda(fazenda);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro ao Cadastrar Fazenda");
    }
  };

  return (
      <View style={styles.container}>
        <Text style={[styles.title,{fontWeight:'bold'}]}>Cadastro de Fazenda</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome da Fazenda"
          onChangeText={text => setNomeFazenda(text)}
          value={nomeFazenda}
        />
        <TextInput
          style={styles.input}
          placeholder="Hectares"
          onChangeText={text => setHectar(text)}
          value={hectar}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Rua"
          onChangeText={text => setRua(text)}
          value={rua}
        />
        <TextInput
          style={styles.input}
          placeholder="Número"
          onChangeText={text => setNumero(text)}
          value={num}
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          onChangeText={text => setCidade(text)}
          value={cidade}
        />
        <View>
        <DropDownPicker
        open={open}
        value={PlantacaoId}
        items={plantioItems}
        setOpen={setOpen}
        setValue={setCultivar}
        style={[pickerStyle,styles.listbox]}
        dropDownContainerStyle={{ width: "75%",position:'absolute', maxHeight: 200, marginTop: 0 }}
        setItems={setPlantios}
        zIndex={9000}
        dropDownDirection="TOP"
        zIndexInverse={1000}
        placeholder='Selecione a cultura'
        
        />
      </View>
      <View>
        <DropDownPicker
          open={open2}
          value={estado}
          items={estadosBrasileiros}
          setOpen={setOpen2}
          setValue={setEstado}
          style={[picker2Style,styles.listbox]}
          dropDownContainerStyle={{ width: "75%",position:'absolute', maxHeight: 500,marginBottom:20 }}
          zIndex={3000}
          zIndexInverse={1000}
          setItems={setEstadosBrasileiros}
          placeholder='Selecione o estado da fazenda' 
        />
      </View>
        <TouchableOpacity style={styles.button} onPress={handleCadastroFazenda}>
          <Text style={{fontWeight:'bold'}}>Cadastrar Fazenda</Text>
        </TouchableOpacity>
      </View>
  );
};
const pickerStyle = {
    height: 0, // Defina a altura desejada
  };
const picker2Style ={
  height:20,
}
export default CadastroFazenda;
