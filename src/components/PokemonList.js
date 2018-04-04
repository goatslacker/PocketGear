/* @flow */

import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import GridView from './GridView';
import PokemonListCard from './PokemonListCard';
import type { Pokemon } from '../types';

const styles = StyleSheet.create({
  grid: {
    backgroundColor: '#fafafa',
  },
});

type Props = {
  navigation: Object,
  data: {
    pokemons: Array<Pokemon>,
  },
  style?: any,
};

const CARD_WIDTH = 160;

export default class PokemonList extends PureComponent<Props, void> {
  scrollTo(options: any) {
    this._root.scrollTo(options);
  }

  _root: Object;

  handlePress(pokemon, rowData) {
    if (this.props.onPress) {
      this.props.onPress(pokemon, rowData);
      return;
    }

    this.props.navigation.navigate('Info', {
      pokemonId: pokemon.id,
    });
  }

  _renderRow = (rowData: any) => {
    const extraProps = this.props.getCardProps
      ? this.props.getCardProps(rowData)
      : {};
    return (
      <PokemonListCard
        pokemon={rowData}
        {...extraProps}
        navigation={this.props.navigation}
        onPress={pokemon => this.handlePress(pokemon, rowData)}
      />
    );
  };

  _getNumberOfColumns = (width: number) => {
    return Math.floor(width / CARD_WIDTH);
  };

  _setRef = (c: Object) => (this._root = c);

  render() {
    return (
      <GridView
        {...this.props}
        pageSize={2}
        style={[styles.grid, this.props.style]}
        spacing={8}
        renderRow={this._renderRow}
        getNumberOfColumns={this._getNumberOfColumns}
        ref={this._setRef}
      />
    );
  }
}
