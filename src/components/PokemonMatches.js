/* @flow */

import React, { PureComponent } from 'react';
import defenderProfile from 'pokemagic/defenderProfile';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

import More from './More';
import MovesetPicker from './MovesetPicker';
import PokemonList from './PokemonList';
import PokemonListCard from './PokemonListCard';
import formatMove from '../utils/formatMove';
import getBestMoveset from '../utils/getBestMoveset';
import shortenMove from '../utils/shortenMove';
import store from '../store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
  },

  content: {
    padding: 4,
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
  },
});

function getDefenderProfile(pokemon, quickMove, chargeMove) {
  const { counters } = defenderProfile(pokemon.name, quickMove, chargeMove, {
    legacy: false,
    numPokemon: 20,
    tm: false,
    // TODO let you configure weather
    weather: 'EXTREME',
  });

  return counters.map(moveset => ({
    key: `${moveset.quick}/${moveset.charge}`,
    quick: moveset.quick,
    charge: moveset.charge,
    results: moveset.results.map(x => {
      const pokemon = store.getPokemonByName(x.name);
      const [quick, charge] = x.stats[0].moves;

      return [
        pokemon.id,
        pokemon.moves.quick.indexOf(quick),
        pokemon.moves.charge.indexOf(charge),
      ];
    }),
  }));
}

function getCardProps(rowData) {
  const pokemon = store.getPokemonByID(rowData[0]);
  const quick = pokemon.moves.quick[rowData[1]] || '?';
  const charge = pokemon.moves.charge[rowData[2]] || '?';
  const subtitle = [quick, charge].map(shortenMove).join('/');

  return {
    pokemon,
    subtitle,
  };
}

function goToBattle(defender, moveset, navigation) {
  return (attacker, rowData) => {
    const [quick, charge] = moveset.split('/');
    const defm1idx = defender.moves.quick.indexOf(quick);
    const defm2idx = defender.moves.charge.indexOf(charge);

    navigation.navigate('Arena', {
      attackerId: attacker.id,
      atkm1idx: rowData[1],
      atkm2idx: rowData[2],
      defenderId: defender.id,
      defm1idx,
      defm2idx,
    });
  };
}

export default class PokemonMatches extends React.Component {
  constructor(props) {
    super();

    const { pokemon } = props;

    const best = getBestMoveset(pokemon);
    const moveset = `${best.quick.Name}/${best.charge.Name}`;
    const data = getDefenderProfile(pokemon, best.quick.Name, best.charge.Name);

    this.state = { moveset, data };
  }

  changeMoveset(moveset) {
    const { pokemon } = this.props;

    if (!moveset) {
      this.setState({
        data: [],
      });
      return;
    }

    const [quick, charge] = moveset.split('/');
    const data = getDefenderProfile(pokemon, quick, charge);
    if (data) {
      this.setState({ moveset, data });
      return;
    }

    this.setState({
      data: [],
    });
  }

  render() {
    const { navigation, pokemon } = this.props;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <MovesetPicker
          onChange={moveset => this.changeMoveset(moveset)}
          pokemon={pokemon}
          value={this.state.moveset}
        />

        {this.state.data.map(({ key, quick, charge, results }) => (
          <View key={key} style={styles.row}>
            <PokemonList
              data={results}
              getCardProps={getCardProps}
              navigation={this.props.navigation}
              onPress={goToBattle(pokemon, this.state.moveset, navigation)}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}
