/* @flow */

import React, { PureComponent } from 'react';
import type { Pokemon } from '../types';
import { Button, FlatList, Text, View, ScrollView, StyleSheet } from 'react-native';

import BattleSimulatorOptions from './BattleSimulatorOptions';
import Placeholder from './Placeholder';
import PokemonListCard from './PokemonListCard';
import Heading from './Heading';

import formatMove from '../utils/formatMove';
import getMoveCombinations from '../utils/getMoveCombinations';
import shortenMove from '../utils/shortenMove';
import store from '../store';

import topPokemon from 'pokemagic/lib/topPokemon';
import simulateBattle from 'pokemagic/simulateBattle';
import getTypeEffectiveness from 'pokemagic/lib/getTypeEffectiveness';

import Appbar from './Appbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },

  col: {
    width: '20%',
  },

  lg: {
    width: '25%',
  },

  sm: {
    width: '15%',
  },

  dmg: {
    alignItems: 'center',
    fontWeight: 'bold',
  },

  time: {
    alignItems: 'center',
    color: '#999',
    fontSize: 11,
  },

  results: {
    marginBottom: 60,
  },

  topSection: {
    marginBottom: 20,
  },

  section: {
    marginVertical: 20,
  },
});

type Props = {
  pokemon: Pokemon,
  style?: any,
};

function renderItem({ item }, results) {
  const pokemon = store.getPokemonByName(results[item.p].name);
  const subtitle= `HP ${item.hp}`

  return (
    <View style={styles.row}>
      <Text style={[styles.col, styles.time]}>
        {item.ms / 1000}s
      </Text>
      <Text style={[styles.col, styles.lg]}>
        {formatMove(pokemon.name)}
      </Text>
      <Text style={[styles.col, styles.sm]}>
        {shortenMove(item.m)}
      </Text>
      <Text style={styles.col}>
        <Text style={styles.dmg}>
          {item.dmg}
        </Text>
        dmg
      </Text>
      <Text style={styles.col}>
        {item.hp}hp
      </Text>
    </View>
  )
}

function BattleResults(props) {
  const { onDone, results } = props;
  const pokemon = store.getPokemonByName(results[results.winner].name)

  let atkHP = results.atk.hp
  let defHP = results.def.hp
  const log = results.log.map(row => {
    if (row.p === 'atk') {
      defHP -= row.dmg
      row.hp = defHP
    }
    if (row.p === 'def') {
      atkHP -= row.dmg
      row.hp = atkHP
    }

    row.key = row.p + row.ms

    return row
  })

  console.log('##', log)

  return (
    <View style={styles.results}>
      <Heading level={1}>Winner</Heading>

      <PokemonListCard
        pokemon={pokemon}
        subtitle={results[results.winner].moves.map(formatMove).join(' & ')}
        toptext={results.winner}
      />

      <Heading level={1}>Battle Stats</Heading>

      <View style={styles.topSection}>
        <Text>Time Elapsed {results.timeElapsed / 1000}s</Text>
        <Text>Damage Taken {results.atk.dmgTaken}</Text>
        <Text>Damage Dealt {results.atk.dmgDealt}</Text>
      </View>

      <Heading>
        {formatMove(results.atk.name)}
      </Heading>
      <Text>{results.atk.moves.map(formatMove).join(' & ')}</Text>
      <Text>CP {results.atk.cp}</Text>
      <Text>HP {results.atk.hp}</Text>

      <Heading>
        {formatMove(results.def.name)}
      </Heading>
      <Text>{results.def.moves.map(formatMove).join(' & ')}</Text>
      <Text>CP {results.def.cp}</Text>
      <Text>HP {results.def.hp}</Text>

      <View style={styles.section}>
        <Button
          color="#801515"
          title="Battle Again?"
          onPress={onDone}
        />
      </View>

      <Heading level={1}>Battle Log</Heading>

      <FlatList
        data={log}
        keyExtractor={item => item.key}
        renderItem={item => renderItem(item, results)}
      />
    </View>
  )
}

export default class Arena extends PureComponent {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      results: null,
    };
  }

  getAttacker() {
    return store.getPokemonByID(this.props.navigation.state.params.attackerId)
  }

  getDefender() {
    return store.getPokemonByID(this.props.navigation.state.params.defenderId)
  }

  runBattleSimulator(state) {
    // TODO scroll the ScrollView up to the top!

    this.setState({ isLoading: true }, () => {
      // TODO custom iv and level for atk and def
      const attacker = {
        iv: 0xfff,
        lvl: 40,
        move1: state.atkMove1,
        move2: state.atkMove2,
        pokemon: state.atk,
      };

      const defender = {
        iv: 0xfff,
        lvl: 40,
        move1: state.defMove1,
        move2: state.defMove2,
        pokemon: state.def,
      };

      const options = {
        raid: state.isRaid,
        weather: state.weather,
      };

      console.log(attacker)
      console.log(defender)
      console.log(options);

      const results = simulateBattle(attacker, defender, options);
      console.log(results)
      this.setState({
        isLoading: false,
        results,
      });
    });
  }

  render() {
    const attacker = this.getAttacker();
    const defender = this.getDefender();
    return (
      <ScrollView {...this.props} style={[styles.container, this.props.style]}>
        <Appbar navigation={this.props.navigation}>
          Battle Simulator
        </Appbar>
        {this.state.isLoading && (
          <Placeholder />
        )}
        {!this.state.results && (
          <BattleSimulatorOptions
            navigation={this.props.navigation}
            onSelect={this.runBattleSimulator.bind(this)}
            attacker={attacker}
            defender={defender}
          />
        )}
        {this.state.results && (
          <BattleResults
            onDone={() => this.setState({ results: null })}
            results={this.state.results}
          />
        )}
      </ScrollView>
    );
  }
}
