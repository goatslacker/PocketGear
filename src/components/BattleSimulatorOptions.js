/* @flow */

import PickerSelect from 'react-native-picker-select';
import React, { PureComponent } from 'react';
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
    paddingHorizontal: 16,
  },

  section: {
    paddingTop: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddc',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  image: {
    height: 72,
    resizeMode: 'contain',
  },

  meta: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    color: '#222',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginHorizontal: 4,
  },

  button: {
    marginTop: 10,
  },

  iv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
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
      dodge,
      isPvP,
      isRaid,
      weather,
    } = this.props;

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
      dodge,
      isPvP,
      isRaid,
      weather,
    });
  }

  toggleRaidPvP(props) {
    if (props.isRaid === true) {
      this.props.onChange({
        isPvP: false,
        isRaid: true,
      });
      return;
    }

    if (props.isPvP === true) {
      this.props.onChange({
        isPvP: true,
        isRaid: false,
      });
      return;
    }

    this.props.onChange(props);
  }

  render() {
    const atkSprite = store.getSprite(this.props.atk.id);
    const defSprite = store.getSprite(this.props.def.id);

    return (
      <View style={styles.container}>
        <View style={[styles.section]}>
          <View style={[styles.row, styles.meta]}>
            <Image style={styles.image} source={atkSprite} />
            <Text style={[styles.name]}>{formatMove(this.props.atk.name)}</Text>
          </View>

          <MovePicker
            pokemon={this.props.atk}
            quickMove={this.props.atkQuick}
            chargeMove={this.props.atkCharge}
            navigation={this.props.navigation}
            onSelectQuickMove={atkQuick => this.props.onChange({ atkQuick })}
            onSelectChargeMove={atkCharge => this.props.onChange({ atkCharge })}
          />

          <View style={styles.iv}>
            <View>
              <Heading style={styles.soft}>Lvl</Heading>
              <PickerSelect
                hideIcon
                items={LEVELS_RANGE}
                onValueChange={atkLVL => this.props.onChange({ atkLVL })}
                value={this.props.atkLVL}
              />
            </View>

            <View>
              <Heading style={styles.soft}>Atk</Heading>
              <PickerSelect
                hideIcon
                items={IV_RANGE}
                onValueChange={atkIVA => this.props.onChange({ atkIVA })}
                value={this.props.atkIVA}
              />
            </View>

            <View>
              <Heading style={styles.soft}>Def</Heading>
              <PickerSelect
                hideIcon
                items={IV_RANGE}
                onValueChange={atkIVD => this.props.onChange({ atkIVD })}
                value={this.props.atkIVD}
              />
            </View>

            <View>
              <Heading style={styles.soft}>Sta</Heading>
              <PickerSelect
                hideIcon
                items={IV_RANGE}
                onValueChange={atkIVS => this.props.onChange({ atkIVS })}
                value={this.props.atkIVS}
              />
            </View>
          </View>
        </View>

        <View style={[styles.section]}>
          <View style={[styles.row, styles.meta]}>
            <Text style={[styles.name]}>{formatMove(this.props.def.name)}</Text>
            <Image style={styles.image} source={defSprite} />
          </View>

          <MovePicker
            pokemon={this.props.def}
            quickMove={this.props.defQuick}
            chargeMove={this.props.defCharge}
            navigation={this.props.navigation}
            onSelectQuickMove={defQuick => this.props.onChange({ defQuick })}
            onSelectChargeMove={defCharge => this.props.onChange({ defCharge })}
          />

          {this.props.isRaid && (
            <View style={styles.iv}>
              <View>
                <Heading style={styles.soft}>Raid Tier</Heading>
                <PickerSelect
                  hideIcon
                  items={RAID_RANGE}
                  onValueChange={defRaidTier =>
                    this.props.onChange({ defRaidTier })
                  }
                  value={this.props.defRaidTier}
                />
              </View>
            </View>
          )}

          {!this.props.isRaid && (
            <View style={styles.iv}>
              <View>
                <Heading style={styles.soft}>Lvl</Heading>
                <PickerSelect
                  hideIcon
                  items={LEVELS_RANGE}
                  onValueChange={defLVL => this.props.onChange({ defLVL })}
                  value={this.props.defLVL}
                />
              </View>

              <View>
                <Heading style={styles.soft}>Atk</Heading>
                <PickerSelect
                  hideIcon
                  items={IV_RANGE}
                  onValueChange={defIVA => this.props.onChange({ defIVA })}
                  value={this.props.defIVA}
                />
              </View>

              <View>
                <Heading style={styles.soft}>Def</Heading>
                <PickerSelect
                  hideIcon
                  items={IV_RANGE}
                  onValueChange={defIVD => this.props.onChange({ defIVD })}
                  value={this.props.defIVD}
                />
              </View>

              <View>
                <Heading style={styles.soft}>Sta</Heading>
                <PickerSelect
                  hideIcon
                  items={IV_RANGE}
                  onValueChange={defIVS => this.props.onChange({ defIVS })}
                  value={this.props.defIVS}
                />
              </View>
            </View>
          )}
        </View>

        <View style={[styles.section, styles.row]}>
          <WeatherPicker
            onWeatherChanged={weather => this.props.onChange({ weather })}
            weather={this.props.weather}
          />

          <View>
            <Heading>Dodge</Heading>

            <Switch
              value={this.props.dodge}
              onValueChange={() =>
                this.props.onChange({ dodge: !this.props.dodge })
              }
            />
          </View>

          <View>
            <Heading>PvP</Heading>

            <Switch
              value={this.props.isPvP}
              onValueChange={() =>
                this.toggleRaidPvP({ isPvP: !this.props.isPvP })
              }
            />
          </View>

          <View>
            <Heading>Raid</Heading>

            <Switch
              value={this.props.isRaid}
              onValueChange={() =>
                this.toggleRaidPvP({ isRaid: !this.props.isRaid })
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
