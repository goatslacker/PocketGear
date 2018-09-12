/* @flow */

import React, { PureComponent } from 'react';
import simulateBattle from 'pokemagic/simulateBattle';
import { ScrollView, StyleSheet } from 'react-native';

import BattleResults from './BattleResults';
import Appbar from './Appbar';
import BattleSimulatorOptions from './BattleSimulatorOptions';
import Placeholder from './Placeholder';
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
    super();
    this.state = {
      isLoading: false,
      results: null,
    };
  }

  getAttacker() {
    const { atkId, atkQuick, atkCharge } = this.props.navigation.state.params;

    const pokemon = store.getPokemonByID(atkId);
    const moves =
      atkQuick !== undefined && atkCharge !== undefined
        ? [atkQuick, atkCharge]
        : [];

    return { moves, pokemon };
  }

  getDefender() {
    const { defId, defQuick, defCharge } = this.props.navigation.state.params;

    const pokemon = store.getPokemonByID(defId);
    const moves =
      defQuick !== undefined && defCharge !== undefined
        ? [defQuick, defCharge]
        : [];

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
      const attacker = {
        iv: state.atk.iv,
        lvl: state.atk.lvl,
        quickMove: state.atk.quickMove,
        chargeMove: state.atk.chargeMove,
        pokemon: state.atk.pokemon,
      };

      const defender = {
        iv: state.def.iv,
        lvl: state.def.lvl,
        quickMove: state.def.quickMove,
        chargeMove: state.def.chargeMove,
        pokemon: state.def.pokemon,
      };

      const options = {
        pvp: state.isPvP,
        raid: state.isRaid,
        raidTier: state.defRaidTier,
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
        ref={scrollView => (this.scrollView = scrollView)}
        style={[styles.container, this.props.style]}
      >
        <Appbar navigation={this.props.navigation}>Battle Simulator</Appbar>
        {this.state.isLoading && <Placeholder />}
        {!this.state.results && (
          <BattleSimulatorOptions
            attacker={attacker}
            defender={defender}
            navigation={this.props.navigation}
            onBattle={state => this.runBattleSimulator(state)}
            weather={this.props.navigation.state.params.weather}
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
