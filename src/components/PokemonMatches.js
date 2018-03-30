/* @flow */

import React, { PureComponent } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import More from './More';
import PokemonListCard from './PokemonListCard';
import type { Pokemon, PokemonID } from '../types';
import store from '../store';
import PokemonList from './PokemonList';
import formatMove from '../utils/formatMove';
import shortenMove from '../utils/shortenMove';

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

function getDefenderProfile(pokemon) {
  // TODO let you configure and run your own
  const { counters } = defenderProfile(pokemon.name, null, null, {
    legacy: false,
    numPokemon: 4,
    raid: true,
    tm: false,
    weather: 'EXTREME',
  });

  return counters.map(moveset => ({
    m1: moveset.quick,
    m2: moveset.charge,
    p: moveset.results.map(x => {
      const pokemon = store.getPokemonByName(x.name)
      const [quick, charge] = x.stats[0].moves

      return [
        pokemon.id,
        pokemon.moves.quick.indexOf(quick),
        pokemon.moves.charge.indexOf(charge),
      ]
    }),
  }));
}

function getCardProps(rowData) {
  const pokemon = store.getPokemonByID(rowData[0]);
  const quick = pokemon.moves.quick[rowData[1]] || '?';
  const charge = pokemon.moves.charge[rowData[2]] || '?';
  const subtitle = [quick, charge].map(shortenMove).join('/')

  return {
    pokemon,
    subtitle,
  }
}

function goToBattle(defender, navigation) {
  return (attacker, rowData) => {
    navigation.navigate('Arena', {
      attackerId: attacker.id,
      defenderId: defender.id,
    });
  }
}

export default function PokemonMatches(props: Props) {
  const { navigation, pokemon } = props;

  const counters = store.getCounters(pokemon.id) || getDefenderProfile(pokemon);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {counters.map(moveset => {
        const key = `${moveset.m1}/${moveset.m2}`;

        return (
          <View key={key}>
            <Text style={styles.heading}>
              {formatMove(moveset.m1)} & {formatMove(moveset.m2)}
            </Text>
            <View style={styles.row}>
              <PokemonList
                data={moveset.p}
                navigation={navigation}
                getCardProps={getCardProps}
                onPress={goToBattle(pokemon, navigation)}
              />
            </View>
          </View>
        )
      })}
    </ScrollView>
  );
}
