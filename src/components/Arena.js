/* @flow */

import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import isLegendary from 'pokemagic/lib/isLegendary';
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
  constructor(props) {
    super(props);

    const attacker = this.getAttacker();
    const defender = this.getDefender();

    this.state = {
      isLoading: false,
      results: null,
      options: {
        atk: attacker.pokemon,
        atkQuick: dex.findMove(attacker.moves[0]),
        atkCharge: dex.findMove(attacker.moves[1]),
        atkIVA: 15,
        atkIVD: 15,
        atkIVS: 15,
        atkLVL: 40,

        def: defender.pokemon,
        defQuick: dex.findMove(defender.moves[0]),
        defCharge: dex.findMove(defender.moves[1]),
        defIVA: 15,
        defIVD: 15,
        defIVS: 15,
        defLVL: 40,
        defRaidTier: 5, // TODO get a default raid level if we have one

        dodge: true,
        isPvP: false,
        isRaid: isLegendary(defender.pokemon.name),
        weather: props.navigation.state.params.weather || 'EXTREME',
      },
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
        atkDodgeStrategy: state.dodge ? 'charge' : null,
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

  updateOptionsState(options) {
    this.setState({
      options: {
        ...this.state.options,
        ...options,
      },
    });
  }

  render() {
    return (
      <ScrollView
        {...this.props}
        ref={scrollView => (this.scrollView = scrollView)}
        style={[styles.container, this.props.style]}
      >
        <Appbar navigation={this.props.navigation} close>
          Battle Simulator
        </Appbar>
        {this.state.isLoading && <Placeholder />}
        {!this.state.results && (
          <BattleSimulatorOptions
            navigation={this.props.navigation}
            onBattle={state => this.runBattleSimulator(state)}
            onChange={options => this.updateOptionsState(options)}
            {...this.state.options}
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
