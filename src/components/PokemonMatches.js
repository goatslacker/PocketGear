/* @flow */

import React, { PureComponent } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import More from './More';
import PokemonListCard from './PokemonListCard';
import getWeakAgainstPokemons from '../utils/getWeakAgainstPokemons';
import getStrongAgainstPokemons from '../utils/getStrongAgainstPokemons';
import findClosestMatch from '../utils/findClosestMatch';
import type { Pokemon, PokemonID } from '../types';
import store from '../store';
import PokemonList from './PokemonList';

import defenderProfile from 'pokemagic/defenderProfile';
import findPokemon from 'pokemagic/lib/findPokemon';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
  },

  content: {
    padding: 4,
  },

  heading: {
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    opacity: 0.5,
    margin: 4,
    marginTop: 16,
    backgroundColor: 'transparent',
  },

  row: {
    flexDirection: 'row',
  },
});

type Props = {
  pokemon: Pokemon,
  style?: any,
  navigation: Object,
};

export default function PokemonMatches(props: Props) {
  const { navigation, pokemon } = props;

  const { counters } = defenderProfile(findPokemon(pokemon.name));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {Object.keys(counters).map(moveCombo => {
        const [quickMove, chargeMove] = moveCombo.split('/');

        const pokemonData = counters[moveCombo].map(counter => (
          store.getPokemonByName(counter[0].name)
        )).filter(Boolean);

        return (
          <View key={moveCombo}>
            <Text style={styles.heading}>
              {quickMove} & {chargeMove}
            </Text>
            <View style={styles.row}>
              <PokemonList
                data={pokemonData}
                navigation={navigation}
              />
            </View>
          </View>
        )
      })}
    </ScrollView>
  );
}
