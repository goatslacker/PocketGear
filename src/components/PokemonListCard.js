/* @flow */

import React, { PureComponent } from 'react';
import TouchableItem from './TouchableItem';
import formatMove from '../utils/formatMove';
import store from '../store';
import throttle from 'lodash/throttle';
import type { Pokemon } from '../types';
import { View, Image, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginVertical: 4,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#666',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },

  subtitle: {
    color: '#888',
    fontFamily: 'Montserrat',
    fontSize: 12,
    textAlign: 'center',
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
    }
  }, 500);

  render() {
    const {
      children,
      height,
      pokemon,
      subtitle,
      style,
      title,
      toptext,
    } = this.props;
    const types = [pokemon.type1, pokemon.type2]
      .filter(Boolean)
      .map(formatMove)
      .join(', ');
    const color = store.getColor(pokemon.type1);
    const sprite = store.getSprite(pokemon.id);
    const margin = Math.floor(height / 6);

    return (
      <View key={pokemon.name} style={[styles.block, style]}>
        <TouchableItem
          onPress={this._handlePress}
          activeOpacity={0.7}
          style={[{ backgroundColor: color }]}
        >
          <Text style={[styles.index, styles.subtitle]}>
            {toptext || `#${pokemon.dex}`}
          </Text>
          <Image
            source={sprite}
            style={[styles.image, { height, width: height, margin }]}
          />
        </TouchableItem>
        <View style={[styles.col]}>
          <Text style={styles.title}>{title || formatMove(pokemon.name)}</Text>
          <Text style={styles.subtitle}>{subtitle || types}</Text>
          {children && children(this.props)}
        </View>
      </View>
    );
  }
}

PokemonListCard.defaultProps = {
  height: 96,
  subtitle: '',
  title: '',
  toptext: '',
};
