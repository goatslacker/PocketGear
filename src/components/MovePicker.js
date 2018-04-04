import React from 'react';
import dex from 'pokemagic/dex';
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
  },
});

function Icon() {
  return Platform.OS === 'ios' ? (
    <EvilIcons name="chevron-right" size={36} style={styles.icon} />
  ) : (
    <MaterialIcons name="chevron-right" size={24} style={styles.icon} />
  );
}

export default function MovePicker({
  pokemon,
  quickMoveIdx,
  chargeMoveIdx,
  onNextQuickMove,
  onNextChargeMove,
}) {
  if (!pokemon) {
    return null;
  }

  const quick = dex.findMove(pokemon.moves.quick[quickMoveIdx]);
  const charge = dex.findMove(pokemon.moves.charge[chargeMoveIdx]);
  const types = [pokemon.type1, pokemon.type2];

  return (
    <View>
      <Heading>Quick Move</Heading>

      <TouchableOpacity
        style={styles.row}
        onPress={() => onNextQuickMove(quickMoveIdx, pokemon)}
      >
        <Attack move={quick} types={types} />
        <Icon />
      </TouchableOpacity>

      <Heading>Charge Move</Heading>

      <TouchableOpacity
        style={styles.row}
        onPress={() => onNextChargeMove(chargeMoveIdx, pokemon)}
      >
        <Attack move={charge} types={types} />
        <Icon />
      </TouchableOpacity>
    </View>
  );
}
