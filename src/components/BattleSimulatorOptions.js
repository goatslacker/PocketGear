/* @flow */

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PickerSelect from 'react-native-picker-select';
import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import isLegendary from 'pokemagic/lib/isLegendary';
import { Button, Switch, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import MovePicker from './MovePicker';
import PokemonListCard from './PokemonListCard';
import formatMove from '../utils/formatMove';
import store from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  icon: {
    color: '#222',
  },

  dropdown: {
    borderWidth: 0,
    backgroundColor: '#cacaca',
    height: 80,
    width: 340,
  },

  dropdownText: {
    fontSize: 16,
  },

  move: {
    marginBottom: 4,
    marginTop: 4,
  },

  moveText: {
    fontSize: 16,
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

type Props = {
  onPress: func,
  style?: any,
};

function createMoveItem(move) {
  return {
    label: formatMove(move),
    value: move,
    key: move,
  }
}

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

export default class BattleSimulatorOptions  extends PureComponent {
  constructor(props) {
    super()

    const { attacker, defender } = props

    this.state = {
      atk: attacker,
      atkIdx1: 0,
      atkIdx2: 0,

      def: defender,
      defIdx1: 0,
      defIdx2: 0,

      isRaid: isLegendary(defender.name),
      text: '',
      weather: 'EXTREME',
    };
  }

  callback() {
    const { atk, def, atkIdx1, atkIdx2, defIdx1, defIdx2, isRaid, weather } = this.state

    const atkQuick = dex.findMove(atk.moves.quick[atkIdx1])
    const atkCharge = dex.findMove(atk.moves.charge[atkIdx2])
    const defQuick = dex.findMove(def.moves.quick[defIdx1])
    const defCharge = dex.findMove(def.moves.charge[defIdx2])

    this.props.onBattle({
      atk: {
        pokemon: atk,
        quickMove: atkQuick,
        chargeMove: atkCharge,
      },
      def: {
        pokemon: def,
        quickMove: defQuick,
        chargeMove: defCharge,
      },
      isRaid,
      weather,
    });
  }

  nextQuickMove(stateKey, id, poke) {
    if (id === poke.moves.quick.length - 1) {
      this.setState({
        [stateKey]: 0,
      })
      return
    }

    this.setState({
      [stateKey]: id + 1,
    })
  }

  nextChargeMove(stateKey, id, poke) {
    if (id === poke.moves.charge.length - 1) {
      this.setState({
        [stateKey]: 0,
      })
      return
    }

    this.setState({
      [stateKey]: id + 1,
    })
  }

  renderAttackerOptions() {
    const { atk, atkIdx1, atkIdx2 } = this.state;

    return (
      <MovePicker
        pokemon={atk}
        quickMoveIdx={atkIdx1}
        chargeMoveIdx={atkIdx2}
        onNextQuickMove={(id, poke) => this.nextQuickMove('atkIdx1', id, poke)}
        onNextChargeMove={(id, poke) => this.nextChargeMove('atkIdx2', id, poke)}
      />
    )
  }

  renderDefenderOptions() {
    const { def, defIdx1, defIdx2 } = this.state

    return (
      <MovePicker
        pokemon={def}
        quickMoveIdx={defIdx1}
        chargeMoveIdx={defIdx2}
        onNextQuickMove={(id, poke) => this.nextQuickMove('defIdx1', id, poke)}
        onNextChargeMove={(id, poke) => this.nextChargeMove('defIdx2', id, poke)}
      />
    )
  }

//  handleChooseYourPokemon() {
//    return;
//
//    const onSelectPokemon = pokemon => this.setState({
//      def: pokemon,
//      defMove1: pokemon.moves.quick[0],
//      defMove2: pokemon.moves.charge[0],
//    });
//    this.props.navigation.navigate('Modal', { onSelectPokemon });
//  }
//  renderOpponent() {
//    return (
//      <Button
//        color="#23238E"
//        title="Select Pokemon"
//        onPress={this.handleChooseYourPokemon.bind(this)}
//      />
//    )
//  }

  render() {
    return (
      <View style={styles.container}>
        <Heading>Attacker</Heading>
        <PokemonListCard
          navigation={this.props.navigation}
          onPress={() => false}
          pokemon={this.state.atk}
        />
        {this.renderAttackerOptions()}

        <View style={styles.section}>
          <Heading>Opponent</Heading>
          <PokemonListCard
            navigation={this.props.navigation}
            onPress={() => false}
            pokemon={this.state.def}
          />
          {this.renderDefenderOptions()}
        </View>

        <View style={[styles.section, styles.row]}>
          <View>
            <Heading>Raid Battle</Heading>

            <Switch
              value={this.state.isRaid}
              onValueChange={() => this.setState({ isRaid: !this.state.isRaid })}
            />
          </View>

          <View>
            <Heading>Weather</Heading>

            <PickerSelect
              hideDoneBar={true}
              hideIcon={true}
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
