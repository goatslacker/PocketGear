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
import formatMove from '../utils/formatMove';

import defenderProfile from 'pokemagic/defenderProfile';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
  },

  content: {
    padding: 4,
    marginTop: 4,
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

  const { counters } = defenderProfile(pokemon.name, null, null, {
    numPokemon: 4,

    // TODO have switches for these settings
    raid: true,
    pvp: false,
    weather: 'EXTREME',
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {counters.map(moveset => {
        const pokemonData = moveset.results.map(result => (
          store.getPokemonByName(result.name)
        )).filter(Boolean);

        const key = `${moveset.quick}/${moveset.charge}`;

        return (
          <View key={key}>
            <Text style={styles.heading}>
              {formatMove(moveset.quick)} & {formatMove(moveset.charge)}
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
