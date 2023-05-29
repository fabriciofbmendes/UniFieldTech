import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { useNavigation,useRoute } from '@react-navigation/native';

const Fazenda = () => { 
    const route = useRoute();
    const { latitude, longitude, hectares } = route.params as FazendaMapa;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Circle
            center={{ latitude, longitude }}
            radius={Math.sqrt(hectares) * 100}
            fillColor="rgba(0, 128, 255, 0.2)"
            strokeColor="rgba(0, 128, 255, 0.8)"
            strokeWidth={2}
          />
        </MapView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: '100%',
      height: '100%',
    },
  });

export default Fazenda;
  