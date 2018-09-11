/* @flow */

import PickerSelect from 'react-native-picker-select';
import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import { View, ScrollView, StyleSheet } from 'react-native';

import FilterToggle from './FilterToggle';
import Heading from './Heading';
import MovePicker from './MovePicker';
import PokemonList from './PokemonList';
import ProgressLabel from './ProgressLabel';
import cache from '../utils/cache';
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

  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  weather: {
    marginLeft: 8,
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

const WEATHER = [
  'SUNNY',
  'CLEAR',
  'PARTLY_CLOUDY',
  'CLOUDY',
  'RAIN',
  'SNOW',
  'WINDY',
  'FOGGY',
  'EXTREME',
].map(key => ({
  key,
  label: formatMove(key),
  value: key,
}));

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

function sort(by, results) {
  results.sort((a, b) => {
    if (by === 'dps') {
      return a[3] > b[3] ? -1 : 1;
    }
    if (by === 'tdo') {
      return a[4] > b[4] ? -1 : 1;
    }
    if (by === 'score') {
      return a[5] > b[5] ? -1 : 1;
    }
    return 1;
  });
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
      weather: 'EXTREME',
    };
  }

  render() {
    const {
      cacheKey,
      getResults,
      handlePokemonPress,
      navigation,
      pokemon,
    } = this.props;
    const { weather, quickMove, chargeMove } = this.state;

    const key = `${cacheKey}+${pokemon.id}@${weather}::${quickMove.Name}/${
      chargeMove.Name
    }`;
    let results = null;
    if (cache.has(key)) {
      results = cache.get(key);
    } else {
      results = getResults(this.state);
      cache.set(key, results);
    }

    const maxDPS = bestDPS(results);
    const maxTDO = bestTDO(results);

    sort(this.state.sort, results);

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
          quickMove={quickMove}
          chargeMove={chargeMove}
          navigation={navigation}
          onSelectQuickMove={quickMove => this.setState({ quickMove })}
          onSelectChargeMove={chargeMove => this.setState({ chargeMove })}
        />
        <View style={styles.options}>
          <View style={styles.weather}>
            <Heading>Weather</Heading>

            <PickerSelect
              hideIcon
              items={WEATHER}
              onValueChange={weather => this.setState({ weather })}
              value={weather}
            />
          </View>
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
        </View>
        <View style={styles.row}>
          <PokemonList
            data={results}
            getCardProps={getCardProps}
            navigation={navigation}
            onPress={(pokemon, rowData) =>
              handlePokemonPress(pokemon, this.state, rowData)
            }
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
