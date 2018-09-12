/* @flow */

import PickerSelect from 'react-native-picker-select';
import React, { PureComponent } from 'react';
import dex from 'pokemagic/dex';
import isLegendary from 'pokemagic/lib/isLegendary';
import { Button, Switch, Image, Text, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import MovePicker from './MovePicker';
import WeatherPicker from './WeatherPicker';
import formatMove from '../utils/formatMove';
import store from '../store';

const LEVELS_RANGE = Array.from(Array(80)).map((_, i) => {
  const level = (i + 1) / 2;
  return {
    key: String(level),
    label: String(level),
    value: level,
  };
});

const RAID_RANGE = [1, 2, 3, 4, 5].map(key => ({
  key,
  label: String(key),
  value: key,
}));

const IV_RANGE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
  key => ({
    key,
    label: String(key),
    value: key,
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  section: {
    paddingBottom: 10,
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

  iv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  soft: {
    color: '#666',
  },
});

function toHex(atk, def, sta) {
  const string = [atk, def, sta].map(n => n.toString(16)).join('');
  return parseInt(string, 16);
}

export default class BattleSimulatorOptions extends PureComponent {
  constructor(props) {
    super();

    const { attacker, defender, weather } = props;

    this.state = {
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

      isPvP: false,
      isRaid: isLegendary(defender.pokemon.name),
      text: '',
      weather: weather || 'EXTREME',
    };
  }

  handleSimulateBattlePress() {
    const {
      atk,
      atkCharge,
      atkIVA,
      atkIVD,
      atkIVS,
      atkLVL,
      atkQuick,
      def,
      defCharge,
      defIVA,
      defIVD,
      defIVS,
      defLVL,
      defQuick,
      isPvP,
      isRaid,
      weather,
    } = this.state;

    this.props.onBattle({
      atk: {
        pokemon: atk,
        quickMove: atkQuick,
        chargeMove: atkCharge,
        lvl: atkLVL,
        iv: toHex(atkIVA, atkIVD, atkIVS),
      },
      def: {
        pokemon: def,
        quickMove: defQuick,
        chargeMove: defCharge,
        lvl: defLVL,
        iv: toHex(defIVA, defIVD, defIVS),
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

          <View style={styles.iv}>
            <View>
              <Heading style={styles.soft}>Lvl</Heading>
              <PickerSelect
                hideIcon
                items={LEVELS_RANGE}
                onValueChange={atkLVL => this.setState({ atkLVL })}
                value={this.state.atkLVL}
              />
            </View>

            <View>
              <Heading style={styles.soft}>Atk</Heading>
              <PickerSelect
                hideIcon
                items={IV_RANGE}
                onValueChange={atkIVA => this.setState({ atkIVA })}
                value={this.state.atkIVA}
              />
            </View>

            <View>
              <Heading style={styles.soft}>Def</Heading>
              <PickerSelect
                hideIcon
                items={IV_RANGE}
                onValueChange={atkIVD => this.setState({ atkIVD })}
                value={this.state.atkIVD}
              />
            </View>

            <View>
              <Heading style={styles.soft}>Sta</Heading>
              <PickerSelect
                hideIcon
                items={IV_RANGE}
                onValueChange={atkIVS => this.setState({ atkIVS })}
                value={this.state.atkIVS}
              />
            </View>
          </View>
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

          {this.state.isRaid && (
            <View style={styles.iv}>
              <View>
                <Heading style={styles.soft}>Raid Tier</Heading>
                <PickerSelect
                  hideIcon
                  items={RAID_RANGE}
                  onValueChange={defRaidTier => this.setState({ defRaidTier })}
                  value={this.state.defRaidTier}
                />
              </View>
            </View>
          )}

          {!this.state.isRaid && (
            <View style={styles.iv}>
              <View>
                <Heading style={styles.soft}>Lvl</Heading>
                <PickerSelect
                  hideIcon
                  items={LEVELS_RANGE}
                  onValueChange={defLVL => this.setState({ defLVL })}
                  value={this.state.defLVL}
                />
              </View>

              <View>
                <Heading style={styles.soft}>Atk</Heading>
                <PickerSelect
                  hideIcon
                  items={IV_RANGE}
                  onValueChange={defIVA => this.setState({ defIVA })}
                  value={this.state.defIVA}
                />
              </View>

              <View>
                <Heading style={styles.soft}>Def</Heading>
                <PickerSelect
                  hideIcon
                  items={IV_RANGE}
                  onValueChange={defIVD => this.setState({ defIVD })}
                  value={this.state.defIVD}
                />
              </View>

              <View>
                <Heading style={styles.soft}>Sta</Heading>
                <PickerSelect
                  hideIcon
                  items={IV_RANGE}
                  onValueChange={defIVS => this.setState({ defIVS })}
                  value={this.state.defIVS}
                />
              </View>
            </View>
          )}
        </View>

        <View style={[styles.section, styles.row]}>
          <WeatherPicker
            onWeatherChanged={weather => this.setState({ weather })}
            weather={this.state.weather}
          />

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
