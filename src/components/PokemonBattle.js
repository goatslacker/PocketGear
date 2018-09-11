/* @flow */

import React, { PureComponent } from 'react';
import attackerProfile from 'pokemagic/lib/attackerProfile';
import dex from 'pokemagic/dex';
import { View, ScrollView, StyleSheet } from 'react-native';

import FilterToggle from './FilterToggle';
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

  toggles: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 2,
  },

  wide: {
    marginTop: 8,
    width: 170,
  },
});

function bestDPS(results) {
  return Math.max.apply(Math.max, results.map(x => x[3]));
}

function bestTDO(results) {
  return Math.max.apply(Math.max, results.map(x => x[4]));
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
function getProfile(pokemon, state) {
  const quickMoveName = state.quickMove.Name;
  const chargeMoveName = state.chargeMove.Name;
  const { data } = attackerProfile({
    chargeMoveName,
    numPokemon: 20,
    pokemon,
    quickMoveName,
    weather: 'EXTREME',
    scoring: state.sort,
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
      sort: 'dps',
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
    const { results } = getProfile(pokemon, this.state);
    const maxDPS = bestDPS(results);
    const maxTDO = bestTDO(results);

    const toggles = [
      { name: 'score', label: 'score', active: this.state.sort === 'score' },
      { name: 'dps', label: 'dps', active: this.state.sort === 'dps' },
      { name: 'tdo', label: 'tdo', active: this.state.sort === 'tdo' },
    ];

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
        <View style={styles.toggles}>
          {toggles.map(toggle => (
            <FilterToggle
              key={toggle.name}
              active={toggle.active}
              label={toggle.label}
              onPress={() => this.setState({ sort: toggle.name })}
            />
          ))}
        </View>
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
                  ratio={dps / maxDPS}
                  value={dps}
                />
                <ProgressLabel
                  color="#5499c7"
                  label="TDO"
                  ratio={tdo / maxTDO}
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
