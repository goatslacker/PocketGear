/* @flow */

import React, { PureComponent } from 'react';
import attackerProfile from 'pokemagic/lib/attackerProfile';
import dex from 'pokemagic/dex';
import { View, ScrollView, StyleSheet } from 'react-native';

import MovesetPicker from './MovesetPicker';
import PokemonList from './PokemonList';
import ProgressLabel from './ProgressLabel';
import formatMove from '../utils/formatMove';
import getBestMoveset from '../utils/getBestMoveset';
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

  wide: {
    marginTop: 8,
    width: 170,
  },
});

function bestDPS(results) {
  if (bestDPS.cache) {
    return bestDPS.cache;
  }

  bestDPS.cache = Math.max.apply(Math.max, results.map(x => x[3]));

  return bestDPS.cache;
}

function bestTDO(results) {
  if (bestTDO.cache) {
    return bestTDO.cache;
  }

  bestTDO.cache = Math.max.apply(Math.max, results.map(x => x[4]));

  return bestTDO.cache;
}

function getCardProps(rowData) {
  const [id, quickMove, chargeMove, dps, tdo, score] = rowData;

  const pokemon = store.getPokemonByID(id);
  const subtitle = `${formatMove(quickMove)} and ${formatMove(chargeMove)}`;

  const color = store.getColor(dex.findMove(chargeMove).Type);

  return {
    pokemon,
    subtitle,
    color,
    dps,
    tdo,
    score,
  };
}

function getProfile(pokemon) {
  const { data } = attackerProfile({
    pokemon,
    numPokemon: 20,
    weather: 'EXTREME',
  });

  return data.map(moveset => ({
    key: `${moveset.quick}/${moveset.charge}`,
    quick: moveset.quick,
    charge: moveset.charge,
    results: moveset.results.map(x => {
      const pokemon = store.getPokemonByName(x.name);
      const [quick, charge] = x.stats[0].moves;

      return [
        pokemon.id,
        quick,
        charge,
        x.stats[0].dps,
        x.stats[0].tdo,
        x.stats[0].score,
      ];
    }),
  }));
}

export default class PokemonBattle extends PureComponent {
  constructor(props) {
    super();

    const { pokemon } = props;

    this.data = getProfile(pokemon);
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

    const [atkQuick, atkCharge] = this.state.moveset.split('/');

    this.props.navigation.navigate('Arena', {
      atkId: pokemon.id,
      atkQuick,
      atkCharge,
      defId: defender.id,
      defQuick: rowData[1],
      defCharge: rowData[2],
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

        {this.state.data.map(({ key, results }) => (
          <View key={key} style={styles.row}>
            <PokemonList
              data={results}
              getCardProps={getCardProps}
              navigation={this.props.navigation}
              onPress={this.handlePokePress.bind(this)}
            >
              {({ dps, tdo, score }) => (
                <View style={[styles.wide]}>
                  <ProgressLabel
                    color="#9575cd"
                    label="Score"
                    ratio={score / results[0][5]}
                    value={Math.round(score)}
                  />
                  <ProgressLabel
                    color="#e57373"
                    label="DPS"
                    ratio={dps / bestDPS(results)}
                    value={dps}
                  />
                  <ProgressLabel
                    color="#5499c7"
                    label="TDO"
                    ratio={tdo / bestTDO(results)}
                    value={tdo}
                  />
                </View>
              )}
            </PokemonList>
          </View>
        ))}
      </ScrollView>
    );
  }
}
