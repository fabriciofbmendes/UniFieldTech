import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from '../../../styles';
import { useNavigation } from '@react-navigation/native';
import { propsStack } from '../../../routes/Stack/Models';
import { cadastrarFazenda, getCoordinates, getUserId } from '../../../api';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';

interface Estado {
    label: string;
    value: string;
  }
  
  interface Plantio{
  label: string;
  value: string;
}

const CadastroFazenda = () => {
  const [nomeFazenda, setNomeFazenda] = useState('');
  const [hectar, setHectar] = useState('');
  const [cultivar, setCultivar] = useState('');
  const [rua, setRua] = useState('');
  const [num, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [estadosBrasileiros, setEstadosBrasileiros] = useState<Estado[]>([
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Minas Gerais', value: 'MG' },
  ]);
const [plantios, setplantios] = useState<Plantio[]>([
    { label: 'Cafe', value: 'Cafe' },
    { label: 'Soja', value: 'Soja' },
  ]);
  
  const navigation = useNavigation<propsStack>();
  
  const handleCadastroFazenda = async () => {
    const fazenda = {
        fazendaID: 0,
        nomeFazenda,
        hectar,
        cultivar,
        rua,
        num,
        cidade,
        estado,
        latitude: '',
        longitude: '',
        tipoPlantio: true,
        areaMecanizada: true,
        clienteID: await getUserId(),
    };
    try {
        const coordinates = await getCoordinates(`${rua}, ${num}, ${cidade}, ${estado}`);
        fazenda.latitude = coordinates.latitude;
        fazenda.longitude = coordinates.longitude;
      } catch (error) {
        console.error('Erro ao buscar as coordenadas:', error);
      }
      
    try {
      await cadastrarFazenda(fazenda);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar fazenda:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Fazenda</Text>
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
      <DropDownPicker
        open={open}
        value={cultivar}
        items={plantios}
        setOpen={setOpen}
        setValue={setCultivar}
        style={pickerStyle}
        setItems={setplantios}
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
       <DropDownPicker
        open={open}
        value={estado}
        items={estadosBrasileiros}
        setOpen={setOpen}
        setValue={setEstado}
        style={pickerStyle}
        setItems={setEstadosBrasileiros}
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastroFazenda}>
        <Text>Cadastrar Fazenda</Text>
      </TouchableOpacity>
    </View>
  );
};
const pickerStyle = {
    height: 40, // Defina a altura desejada
  };
export default CadastroFazenda;
