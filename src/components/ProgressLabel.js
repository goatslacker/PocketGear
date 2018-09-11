import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import ProgressBar from './ProgressBar';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  text: {
    color: '#888',
    fontFamily: 'Montserrat',
    fontSize: 12,
  },

  center: {
    alignItems: 'center',
  },

  label: {
    marginRight: 4,
    width: 40,
  },

  amount: {
    textAlign: 'right',
    width: 50,
  },
});

export default function ProgressLabel({ color, label, ratio, value }) {
  return (
    <View style={[styles.row, styles.center]}>
      <Text style={[styles.text, styles.label]}>{label}</Text>
      <ProgressBar ratio={ratio || 0} fillColor={color} />
      <Text style={[styles.text, styles.amount]}>{value}</Text>
    </View>
  );
}
