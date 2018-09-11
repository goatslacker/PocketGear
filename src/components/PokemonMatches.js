/* @flow */

import React from 'react';
import defenderProfile from 'pokemagic/defenderProfile';
import dex from 'pokemagic/dex';
import { View, ScrollView, StyleSheet } from 'react-native';

import MovePicker from './MovePicker';
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

// TODO build a small lru cache to hold these in
function getDefenderProfile(pokemon, quickMoveName, chargeMoveName) {
  const { data } = defenderProfile({
    chargeMoveName,
    filterAttackerMoveset: move => move.legacy === 0,
    numPokemon: 20,
    pokemon,
    quickMoveName,
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

function goToBattle(defender, quickMove, chargeMove, navigation) {
  return (attacker, rowData) => {
    navigation.navigate('Arena', {
      atkId: attacker.id,
      atkQuick: rowData[1],
      atkCharge: rowData[2],
      defId: defender.id,
      defQuick: quickMove,
      defCharge: chargeMove,
    });
  };
}

export default class PokemonMatches extends React.Component {
  constructor(props) {
    super();

    const { pokemon } = props;

    const best = getBestMoveset(pokemon);

    this.state = {
      chargeMove: best.charge,
      quickMove: best.quick,
    };
  }

  render() {
    const { navigation, pokemon } = this.props;
    const { quickMove, chargeMove } = this.state;
    const data = getDefenderProfile(pokemon, quickMove.Name, chargeMove.Name);

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <MovePicker
          pokemon={pokemon}
          quickMove={quickMove}
          chargeMove={chargeMove}
          navigation={navigation}
          onSelectQuickMove={quickMove => this.setState({ quickMove })}
          onSelectChargeMove={chargeMove => this.setState({ chargeMove })}
        />

        {data.map(({ key, results }) => (
          <View key={key} style={styles.row}>
            <PokemonList
              data={results}
              getCardProps={getCardProps}
              navigation={this.props.navigation}
              onPress={goToBattle(pokemon, quickMove, chargeMove, navigation)}
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
