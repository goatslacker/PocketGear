/* @flow */

import PickerSelect from 'react-native-picker-select';
import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import isLegendary from 'pokemagic/lib/isLegendary';
import { Button, Switch, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import MovesetPicker from './MovesetPicker';
import PokemonListCard from './PokemonListCard';
import formatMove from '../utils/formatMove';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  section: {
    marginTop: 20,
    marginBottom: 20,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default class BattleSimulatorOptions extends PureComponent {
  constructor(props) {
    super();

    const { attacker, defender, weather } = props;

    this.state = {
      atk: attacker.pokemon,
      atkMoves: `${attacker.moves[0]}/${attacker.moves[1]}`,

      def: defender.pokemon,
      defMoves: `${defender.moves[0]}/${defender.moves[1]}`,

      isPvP: false,
      isRaid: isLegendary(defender.pokemon.name),
      text: '',
      weather: weather || 'EXTREME',
    };
  }

  callback() {
    const { atk, atkMoves, def, defMoves, isPvP, isRaid, weather } = this.state;

    const [atkQuick, atkCharge] = atkMoves.split('/');
    const [defQuick, defCharge] = defMoves.split('/');

    const atkQuickMove = dex.findMove(atkQuick);
    const atkChargeMove = dex.findMove(atkCharge);
    const defQuickMove = dex.findMove(defQuick);
    const defChargeMove = dex.findMove(defCharge);

    this.props.onBattle({
      atk: {
        pokemon: atk,
        quickMove: atkQuickMove,
        chargeMove: atkChargeMove,
      },
      def: {
        pokemon: def,
        quickMove: defQuickMove,
        chargeMove: defChargeMove,
      },
      isPvP,
      isRaid,
      weather,
    });
  }

  renderAttackerOptions() {
    const { atk, atkMoves } = this.state;

    return (
      <MovesetPicker
        onChange={atkMoves => this.setState({ atkMoves })}
        pokemon={atk}
        value={atkMoves}
      />
    );
  }

  renderDefenderOptions() {
    const { def, defMoves } = this.state;

    return (
      <MovesetPicker
        onChange={defMoves => this.setState({ defMoves })}
        pokemon={def}
        value={defMoves}
      />
    );
  }

  toggleRaidPvP(state) {
    if (state.isRaid === true) {
      this.setState({
        isPvP: false,
        isRaid: true,
      });
      return;
    }

    if (state.isPvP === true) {
      this.setState({
        isPvP: true,
        isRaid: false,
      });
      return;
    }

    this.setState(state);
  }

  render() {
    return (
      <View style={styles.container}>
        <Heading>Attacker</Heading>
        <PokemonListCard
          navigation={this.props.navigation}
          pokemon={this.state.atk}
        />
        {this.renderAttackerOptions()}

        <View style={styles.section}>
          <Heading>Opponent</Heading>
          <PokemonListCard
            navigation={this.props.navigation}
            pokemon={this.state.def}
          />
          {this.renderDefenderOptions()}
        </View>

        <View style={[styles.section, styles.row]}>
          <View>
            <Heading>Raid Battle</Heading>

            <Switch
              value={this.state.isRaid}
              onValueChange={() =>
                this.toggleRaidPvP({ isRaid: !this.state.isRaid })
              }
            />
          </View>

          <View>
            <Heading>PVP</Heading>

            <Switch
              value={this.state.isPvP}
              onValueChange={() =>
                this.toggleRaidPvP({ isPvP: !this.state.isPvP })
              }
            />
          </View>

          <View>
            <Heading>Weather</Heading>

            <PickerSelect
              hideDoneBar
              hideIcon
              items={WEATHER}
              onValueChange={weather => this.setState({ weather })}
              value={this.state.weather}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Button
            accessibilityLabel="Battle this Pokemon"
            color="#801515"
            title="Simulate Battle"
            onPress={() => this.callback()}
          />
        </View>
      </View>
    );
  }
}
