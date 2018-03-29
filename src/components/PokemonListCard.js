/* @flow */

import React, { PureComponent } from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import TouchableItem from './TouchableItem';
import store from '../store';
import type { Pokemon } from '../types';
import throttle from 'lodash/throttle';
import formatMove from '../utils/formatMove';

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 2,
  },

  image: {
    resizeMode: 'contain',
  },

  index: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 8,
  },

  title: {
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },

  subtitle: {
    color: '#000',
    fontFamily: 'Montserrat',
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.5,
  },
});

type Props = {
  height?: number,
  navigation: Object,
  pokemon: Pokemon,
  onPress?: func,
  subtitle?: string,
  style?: any,
  title?: string,
  toptext?: string,
};

export default class PokemonListCard extends PureComponent<Props, void> {
  _handlePress = throttle(() => {
    if (this.props.onPress) {
      this.props.onPress(this.props.pokemon);
      return;
    }

    this.props.navigation.navigate('Info', {
      pokemonId: this.props.pokemon.id,
    });
  }, 500);

  render() {
    const { height, pokemon, subtitle, style, title, toptext } = this.props;
    const types = [pokemon.type1, pokemon.type2]
      .filter(Boolean)
      .map(formatMove)
      .join(', ');
    const color = store.getColor(pokemon.type1);
    const sprite = store.getSprite(pokemon.id);
    const margin = Math.floor(height / 6);

    return (
      <TouchableItem
        key={pokemon.name}
        onPress={this._handlePress}
        activeOpacity={0.7}
        style={[styles.block, { backgroundColor: color }, style]}
      >
        <Text style={[styles.index, styles.subtitle]}>{toptext || `#${pokemon.id}`}</Text>
        <Image source={sprite} style={[styles.image, { height, margin }]} />
        <Text style={styles.title}>{title || pokemon.name}</Text>
        <Text style={styles.subtitle}>{subtitle || types}</Text>
      </TouchableItem>
    );
  }
}

PokemonListCard.defaultProps = {
  height: 96,
  subtitle: '',
  title: '',
  toptext: '',
};
