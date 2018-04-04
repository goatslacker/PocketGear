/* @flow */

import React, { PureComponent } from 'react';
import getTypeEffectiveness from 'pokemagic/lib/getTypeEffectiveness';
import topPokemon from 'pokemagic/lib/topPokemon';
import { Text, View, ScrollView, StyleSheet } from 'react-native';

import MovesetPicker from './MovesetPicker';
import PokemonList from './PokemonList';

import formatMove from '../utils/formatMove';
import getMoveCombinations from '../utils/getMoveCombinations';
import getBestMoveset from '../utils/getBestMoveset';

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

export default class PokemonBattle extends PureComponent {
  constructor(props) {
    super();

    const { pokemon } = props;

    this.data = getMoveCombinations(pokemon).map(({ quick, charge }) => {
      return {
        key: `${quick.Name}/${charge.Name}`,
        quick,
        charge,
        results: topPokemon
          .reduce((acc, pokemon) => {
            const fx = getTypeEffectiveness(pokemon, charge);

            if (fx >= 1) {
              acc.push({ pokemon, fx });
            }

            return acc;
          }, [])
          .sort((a, b) => {
            if (a.fx === b.fx) {
              return 0;
            }
            return a.fx > b.fx ? -1 : 1;
          })
          .map(x => x.pokemon)
          .slice(0, 20),
      };
    });

    const best = getBestMoveset(pokemon);
    const moveset = `${best.quick.Name}/${best.charge.Name}`;

    this.state = {
      data: [this.data[0]],
      moveset,
    };
  }

  changeMoveset(moveset) {
    const result = this.data.find(move => move.key === moveset);
    if (result) {
      const data = [result];
      this.setState({ moveset, data });
      return;
    }

    this.setState({
      data: [],
    });
  }

  handlePokePress(defender, rowData) {
    const { pokemon } = this.props;

    const [quick, charge] = this.state.moveset.split('/');
    const atkm1idx = pokemon.moves.quick.indexOf(quick);
    const atkm2idx = pokemon.moves.charge.indexOf(charge);

    this.props.navigation.navigate('Arena', {
      attackerId: pokemon.id,
      atkm1idx,
      atkm2idx,
      defenderId: defender.id,
      defm1idx: rowData[1],
      defm2idx: rowData[2],
    });
  }

  render() {
    const { pokemon } = this.props;

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
              navigation={this.props.navigation}
              onPress={this.handlePokePress.bind(this)}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}
