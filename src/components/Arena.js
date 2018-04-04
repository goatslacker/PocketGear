/* @flow */

import React, { PureComponent } from 'react';
import getTypeEffectiveness from 'pokemagic/lib/getTypeEffectiveness';
import simulateBattle from 'pokemagic/simulateBattle';
import topPokemon from 'pokemagic/lib/topPokemon';
import { Button, FlatList, Text, View, ScrollView, StyleSheet } from 'react-native';

import BattleResults from './BattleResults';
import Appbar from './Appbar';
import BattleSimulatorOptions from './BattleSimulatorOptions';
import Heading from './Heading';
import Placeholder from './Placeholder';
import PokemonListCard from './PokemonListCard';
import formatMove from '../utils/formatMove';
import getMoveCombinations from '../utils/getMoveCombinations';
import shortenMove from '../utils/shortenMove';
import store from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default class Arena extends PureComponent {
  constructor() {
    super()
    this.state = {
      isLoading: false,
      results: null,
    };
  }

  getAttacker() {
    const {
      attackerId,
      atkm1idx,
      atkm2idx,
    } = this.props.navigation.state.params;

    const pokemon = store.getPokemonByID(attackerId);
    const moves = atkm1idx !== undefined && atkm2idx !== undefined ? [atkm1idx, atkm2idx] : [];

    return { moves, pokemon };
  }

  getDefender() {
    const {
      defenderId,
      defm1idx,
      defm2idx,
    } = this.props.navigation.state.params;

    const pokemon = store.getPokemonByID(defenderId);
    const moves = defm1idx !== undefined && defm2idx !== undefined ? [defm1idx, defm2idx] : [];

    return { moves, pokemon };
  }

  clearResults() {
    if (this.scrollView) {
      this.scrollView.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }
    this.setState({ results: null });
  }

  runBattleSimulator(state) {
    if (this.scrollView) {
      this.scrollView.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });
    }

    this.setState({ isLoading: true }, () => {
      // TODO custom iv and level for atk and def
      const attacker = {
        iv: 0xfff,
        lvl: 40,
        quickMove: state.atk.quickMove,
        chargeMove: state.atk.chargeMove,
        pokemon: state.atk.pokemon,
      };

      const defender = {
        iv: 0xfff,
        lvl: 40,
        quickMove: state.def.quickMove,
        chargeMove: state.def.chargeMove,
        pokemon: state.def.pokemon,
      };

      const options = {
        pvp: state.isPvP,
        raid: state.isRaid,
        weather: state.weather,
      };

      const results = simulateBattle(attacker, defender, options);

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
      <ScrollView
        {...this.props}
        ref={scrollView => this.scrollView = scrollView}
        style={[styles.container, this.props.style]}
      >
        <Appbar navigation={this.props.navigation}>
          Battle Simulator
        </Appbar>
        {this.state.isLoading && (
          <Placeholder />
        )}
        {!this.state.results && (
          <BattleSimulatorOptions
            attacker={attacker}
            defender={defender}
            navigation={this.props.navigation}
            onBattle={state => this.runBattleSimulator(state)}
          />
        )}
        {this.state.results && (
          <BattleResults
            onDone={() => this.clearResults()}
            results={this.state.results}
          />
        )}
      </ScrollView>
    );
  }
}
