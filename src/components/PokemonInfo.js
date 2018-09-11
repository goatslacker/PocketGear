/* @flow */

import find from 'lodash/find';
import memoize from 'lodash/memoize';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import Appbar from './Appbar';
import DelayedItem from './DelayedItem';
import PokemonDetails from './PokemonDetails';
import PokemonMatches from './PokemonMatches';
import PokemonBattle from './PokemonBattle';
import store from '../store';
import type { PokemonID, Pokemon } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  appbar: {
    elevation: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0,
  },

  tabbar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: 'rgba(0, 0, 0, 0.16)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  tablabel: {
    color: '#222',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    marginVertical: 8,
  },

  indicator: {
    backgroundColor: '#222',
  },
});

type Props = {
  navigation: Object,
  style?: any,
};

const InfoTabs = TabNavigator(
  {
    Details: {
      screen: ({ screenProps, ...rest }) => (
        <PokemonDetails {...rest} {...screenProps} />
      ),
    },
    Counters: {
      screen: ({ screenProps, ...rest }) => (
        <DelayedItem {...rest} {...screenProps} component={PokemonMatches} />
      ),
    },
    Battle: {
      screen: ({ screenProps, ...rest }) => (
        <DelayedItem {...rest} {...screenProps} component={PokemonBattle} />
      ),
    },
  },
  {
    ...TabNavigator.Presets.AndroidTopTabs,
    tabBarOptions: {
      style: styles.tabbar,
      indicatorStyle: styles.indicator,
      labelStyle: styles.tablabel,
      activeTintColor: '#222',
      inactiveTintColor: '#222',
    },
    backBehavior: 'none',
    initialRouteName: 'Details',
    order: ['Details', 'Counters', 'Battle'],
  }
);

class PokemonInfo extends PureComponent<Props, void> {
  static router = InfoTabs.router;

  _getPokemon: (id: PokemonID) => Pokemon = memoize((id: PokemonID) => {
    const pokemons = store.getPokemons();
    const pokemon = find(pokemons, { id });
    return pokemon;
  });

  render() {
    const pokemon = this._getPokemon(
      this.props.navigation.state.params.pokemonId
    );

    return (
      <View {...this.props} style={[styles.container, this.props.style]}>
        <Appbar style={styles.appbar} navigation={this.props.navigation}>
          {'#' + pokemon.dex}
        </Appbar>
        <InfoTabs
          screenProps={{ pokemon }}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

export default PokemonInfo;
