/* @flow */

import PickerSelect from 'react-native-picker-select';
import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import isLegendary from 'pokemagic/lib/isLegendary';
import { Button, Switch, Image, Text, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import MovePicker from './MovePicker';
import formatMove from '../utils/formatMove';
import store from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  section: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddc',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  image: {
    height: 72,
    resizeMode: 'contain',
    marginBottom: -12,
  },

  meta: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  name: {
    color: '#222',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
  },

  button: {
    marginTop: 10,
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
      atkQuick: dex.findMove(attacker.moves[0]),
      atkCharge: dex.findMove(attacker.moves[1]),

      def: defender.pokemon,
      defQuick: dex.findMove(defender.moves[0]),
      defCharge: dex.findMove(defender.moves[1]),

      isPvP: false,
      isRaid: isLegendary(defender.pokemon.name),
      text: '',
      weather: weather || 'EXTREME',
    };
  }

  handleSimulateBattlePress() {
    const {
      atk,
      atkQuick,
      atkCharge,
      def,
      defQuick,
      defCharge,
      defMoves,
      isPvP,
      isRaid,
      weather,
    } = this.state;

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
      isPvP,
      isRaid,
      weather,
    });
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
    const atkSprite = store.getSprite(this.state.atk.id);
    const defSprite = store.getSprite(this.state.def.id);

    return (
      <View style={styles.container}>
        <View style={[styles.section]}>
          <View style={[styles.row, styles.meta]}>
            <Text style={[styles.name]}>{formatMove(this.state.atk.name)}</Text>
            <Image style={styles.image} source={atkSprite} />
          </View>

          <MovePicker
            pokemon={this.state.atk}
            quickMove={this.state.atkQuick}
            chargeMove={this.state.atkCharge}
            navigation={this.props.navigation}
            onSelectQuickMove={atkQuick => this.setState({ atkQuick })}
            onSelectChargeMove={atkCharge => this.setState({ atkCharge })}
          />
        </View>

        <View style={[styles.section]}>
          <View style={[styles.row, styles.meta]}>
            <Text style={[styles.name]}>{formatMove(this.state.def.name)}</Text>
            <Image style={styles.image} source={defSprite} />
          </View>

          <MovePicker
            pokemon={this.state.def}
            quickMove={this.state.defQuick}
            chargeMove={this.state.defCharge}
            navigation={this.props.navigation}
            onSelectQuickMove={defQuick => this.setState({ defQuick })}
            onSelectChargeMove={defCharge => this.setState({ defCharge })}
          />
        </View>

        <View style={[styles.section, styles.row]}>
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
            <Heading>Raid Battle</Heading>

            <Switch
              value={this.state.isRaid}
              onValueChange={() =>
                this.toggleRaidPvP({ isRaid: !this.state.isRaid })
              }
            />
          </View>
        </View>

        <View style={styles.button}>
          <Button
            accessibilityLabel="Battle this Pokemon"
            color="#e57373"
            title="Simulate Battle"
            onPress={() => this.handleSimulateBattlePress()}
          />
        </View>
      </View>
    );
  }
}
