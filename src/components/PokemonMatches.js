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

function ucFirst(text) {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1);
}

function formatMove(moveName) {
  return ucFirst(moveName.replace(/_FAST$/, '').replace(/_/g, ' '));
}

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
