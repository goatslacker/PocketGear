/* @flow */

import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Move } from '../types';
import ucFirst from '../utils/ucFirst';
import formatMove from '../utils/formatMove';

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },

  text: {
    color: '#222',
    fontFamily: 'Montserrat',
    fontSize: 13,
    lineHeight: 20,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 4,
  },

  type: {
    width: 120,
  },

  energy: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4fc3f7',
    marginHorizontal: 2,
    marginVertical: 10,
  },

  damage: {
    width: 80,
    alignItems: 'flex-end',
  },

  subtitle: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: '#999',
    marginVertical: 4,
  },

  energyQuick: {
    color: '#999',
  },

  stab: {
    color: '#4caf50',
  },
});

type Props = {
  move: Move,
  types: Array<*>,
};

const quickMoveRx = /_FAST$/;
function isQuickMove(move) {
  return quickMoveRx.test(move.Name);
}

function isLegacy(legacy) {
  if (legacy === 1 || legacy === 2) {
    return ' (L)'
  }
  if (legacy === 4) {
    return ' (CD)'
  }
  return null
}

export default function Attack(props: Props) {
  const { move, types } = props;

  const prettyType = ucFirst(move.Type.toLowerCase());

  const power = move.Power || 0;
  const multiplier = types.includes(prettyType) ? 1.25 : 1;
  const stab = Math.floor(power * (multiplier - 1));

  return (
    <View style={styles.row}>
      <View style={styles.type}>
        <Text style={styles.text}>{formatMove(move.Name)}{isLegacy(move.legacy)}</Text>
        <Text style={styles.subtitle}>{prettyType}</Text>
      </View>
      {!isQuickMove(move) && move.Energy ? (
        Array.from({
          length: Math.abs(Math.round(100 / move.Energy)),
        }).map((_, i) => {
          return <View key={i} style={styles.energy} />;
        })
      ) : (
        <View style={styles.spacer}>
          <Text style={[styles.text, styles.energyQuick]}>
            {(move.Power / (move.DurationMs / 1000)).toFixed(1)} dps
          </Text>
          <Text style={[styles.text, styles.energyQuick]}>
            {(move.Energy / (move.DurationMs / 1000)).toFixed(1)} eps
          </Text>
        </View>
      )}
      <View style={styles.damage}>
        <Text style={styles.text}>
          {power} {stab ? <Text style={styles.stab}>+{stab} </Text> : ''}
        </Text>
        <Text style={styles.subtitle}>{move.DurationMs / 1000}s</Text>
      </View>
    </View>
  );
}
