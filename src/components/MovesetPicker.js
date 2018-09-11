import PickerSelect from 'react-native-picker-select';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import formatMove from '../utils/formatMove';
import getMoveCombinations from '../utils/getMoveCombinations';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.75,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
});

export default function MovesetPicker({ onChange, pokemon, value }) {
  const moveCombos = getMoveCombinations(pokemon).map(move => ({
    key: `${move.quick.Name}/${move.charge.Name}`,
    label: `${formatMove(move.quick.Name)} & ${formatMove(move.charge.Name)}`,
    value: `${move.quick.Name}/${move.charge.Name}`,
  }));

  return (
    <View style={styles.center}>
      <PickerSelect
        hideDoneBar
        hideIcon
        items={moveCombos}
        onValueChange={combo => onChange(combo)}
        style={{ inputIOS: styles.heading }}
        value={value}
      />
    </View>
  );
}
