/* @flow */

import React, { PureComponent } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import type { Pokemon, PokemonID } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 16,
  },

  item: {
    marginVertical: 16,
  },
});

type Props = {
  pokemon: Pokemon,
  style?: any,
  navigation: Object,
};

export default class PokemonTools extends PureComponent<Props, void> {
  _goToPokemon = (pokemonId: PokemonID) => () => {
    this.props.navigation.navigate('Info', {
      pokemonId,
    });
  };

  render() {
    return (
      <ScrollView {...this.props} style={[styles.container, this.props.style]}>
        <View style={styles.content}>
          <Text>
            Battle Simulator is under construction.
          </Text>
        </View>
      </ScrollView>
    );
  }
}
