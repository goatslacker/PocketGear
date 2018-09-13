import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Attack from './Attack';
import Heading from './Heading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },

  icon: {
    color: '#999',
    marginLeft: 8,
  },
});

function Icon() {
  return Platform.OS === 'ios' ? (
    <EvilIcons name="gear" size={24} style={styles.icon} />
  ) : (
    <MaterialIcons name="edit" size={24} style={styles.icon} />
  );
}

export default function MovePicker({
  pokemon,
  quickMove,
  chargeMove,
  navigation,
  onSelectQuickMove,
  onSelectChargeMove,
}) {
  if (!pokemon) {
    return null;
  }

  const types = [pokemon.type1, pokemon.type2];

  return (
    <View>
      <Heading>Moves</Heading>

      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate('Moves', {
            id: pokemon.id,
            onSelectMove: onSelectQuickMove,
            moves: 'quick',
          })
        }
      >
        <Attack move={quickMove} types={types} />
        <Icon style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() =>
          navigation.navigate('Moves', {
            id: pokemon.id,
            onSelectMove: onSelectChargeMove,
            moves: 'charge',
          })
        }
      >
        <Attack move={chargeMove} types={types} />
        <Icon style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}
