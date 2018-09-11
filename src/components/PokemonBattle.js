/* @flow */

import React, { PureComponent } from 'react';
import attackerProfile from 'pokemagic/lib/attackerProfile';
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

function getCardProps(rowData) {
  const [id, quickMoveName, chargeMoveName, dps, tdo, total] = rowData;

  const pokemon = store.getPokemonByID(id);
  const subtitle = `${formatMove(quickMoveName)} and ${formatMove(
    chargeMoveName
  )}`;

  const color = store.getColor(dex.findMove(chargeMoveName).Type);

  return {
    pokemon,
    subtitle,
    color,
    dps,
    tdo,
    total,
  };
}

// TODO lru cache
function getProfile(pokemon, quickMoveName, chargeMoveName) {
  const { data } = attackerProfile({
    chargeMoveName,
    numPokemon: 20,
    pokemon,
    quickMoveName,
    weather: 'EXTREME',
  });

  const [moveset] = data;

  return {
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
        x.stats[0].total,
      ];
    }),
  };
}

export default class PokemonBattle extends PureComponent {
  constructor(props) {
    super();

    const { pokemon } = props;
    const best = getBestMoveset(pokemon);

    this.state = {
      quickMove: best.quick,
      chargeMove: best.charge,
    };
  }

  handlePokePress(defender, rowData) {
    const { pokemon } = this.props;

    this.props.navigation.navigate('Arena', {
      atkId: pokemon.id,
      atkQuick: this.state.quickMove.Name,
      atkCharge: this.state.chargeMove.Name,
      defId: defender.id,
      defQuick: rowData[1],
      defCharge: rowData[2],
    });
  }

  render() {
    const { pokemon } = this.props;
    const { results } = getProfile(
      pokemon,
      this.state.quickMove.Name,
      this.state.chargeMove.Name
    );

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <MovePicker
          pokemon={pokemon}
          quickMove={this.state.quickMove}
          chargeMove={this.state.chargeMove}
          navigation={this.props.navigation}
          onSelectQuickMove={quickMove => this.setState({ quickMove })}
          onSelectChargeMove={chargeMove => this.setState({ chargeMove })}
        />
        <View style={styles.row}>
          <PokemonList
            data={results}
            getCardProps={getCardProps}
            navigation={this.props.navigation}
            onPress={this.handlePokePress.bind(this)}
          >
            {({ dps, tdo, total }) => (
              <View style={[styles.wide]}>
                <ProgressLabel
                  color="#9575cd"
                  label="Score"
                  ratio={total / results[0][5]}
                  value={Math.round(total)}
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
      </ScrollView>
    );
  }
}
