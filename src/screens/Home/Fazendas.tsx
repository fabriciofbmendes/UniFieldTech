import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FarmDetailsPage = ({ route }) => {
  // Extrair os parâmetros passados pela navegação
  const { farmName, farmLocation, farmDescription } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{farmName}</Text>
      <Text style={styles.subtitle}>{farmLocation}</Text>
      <Text style={styles.description}>{farmDescription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FarmDetailsPage;
