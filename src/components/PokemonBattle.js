/* @flow */

import React, { PureComponent } from 'react';
import type { Pokemon } from '../types';
import { View, ScrollView, StyleSheet } from 'react-native';

import PokemonList from './PokemonList';
import Heading from './Heading';

import formatMove from '../utils/formatMove';
import getMoveCombinations from '../utils/getMoveCombinations';

import topPokemon from 'pokemagic/lib/topPokemon';
import getTypeEffectiveness from 'pokemagic/lib/getTypeEffectiveness';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

type Props = {
  pokemon: Pokemon,
  style?: any,
};

function moveDPS(pokemon, moves) {
  const stabQuick = pokemon.type1 === moves.quick.Type || pokemon.type2 === moves.quick.Type;
  const stabCharge = pokemon.type1 === moves.charge.Type || pokemon.type2 === moves.charge.Type;

  const quickDMG = (moves.quick.Power || 0) * stabQuick + 1;
  const chargeDMG = (moves.charge.Power || 0) * stabCharge + 1;

  const e100 = Math.ceil(100 / moves.quick.Energy);
  const totalQuickDMG = quickDMG * e100;
  const totalQuickTime = moves.quick.DurationMs * e100;

  const charges = Math.floor(Math.abs(100 / moves.charge.Energy));
  const totalChargeDMG = chargeDMG * charges;
  const totalChargeTime = moves.charge.DurationMs * charges;

  return (totalQuickDMG + totalChargeDMG) / ((totalQuickTime + totalChargeTime) / 1000);
}

function comboDPS(pokemon) {
  return (a, b) => {
    const dpsA = moveDPS(pokemon, a);
    const dpsB = moveDPS(pokemon, b);

    return dpsA > dpsB ? -1 : 1;
  };
}

export default class PokemonBattle extends PureComponent {
  constructor(props) {
    super();

    const { pokemon } = props;

    const moveCombos = getMoveCombinations(pokemon).sort(comboDPS(pokemon));

    this.data = moveCombos.map(({ quick, charge }) => {
      return {
        key: `${quick}/${charge}`,
        quick,
        charge,
        results: topPokemon
          .reduce((acc, pokemon) => {
            const fx = getTypeEffectiveness(pokemon, charge)

            if (fx >= 1) {
              acc.push({ pokemon, fx })
            }

            return acc
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
  }

  render() {
    // TODO when you tap on these take you to the battle screen
    return (
      <ScrollView {...this.props} style={[styles.container, this.props.style]}>
        {this.data.map(({ key, quick, charge, results }) => (
          <View key={key}>
            <Heading>{formatMove(quick.Name)} & {formatMove(charge.Name)}</Heading>
            <PokemonList
              data={results}
              navigation={this.props.navigation}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}
