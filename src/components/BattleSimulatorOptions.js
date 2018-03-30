/* @flow */

import React, { PureComponent } from 'react';
import { Button, Switch, Text, View, StyleSheet } from 'react-native';
import PickerSelect from 'react-native-picker-select';

import Heading from './Heading';
import PokemonListCard from './PokemonListCard';
import formatMove from '../utils/formatMove';
import store from '../store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
      atkMove1: attacker.moves.quick[0],
      atkMove2: attacker.moves.charge[0],
      def: defender,
      defMove1: defender.moves.quick[0],
      defMove2: defender.moves.charge[0],
      isRaid: false,
      text: '',
      weather: 'EXTREME',
    };
  }

  renderAttackerOptions() {
    const { atk } = this.state;

    return (
      <View>
        <Heading>Quick Move</Heading>

        <PickerSelect
          hideDoneBar={true}
          hideIcon={true}
          items={atk.moves.quick.map(createMoveItem)}
          onValueChange={atkMove1 => this.setState({ atkMove1 })}
          value={this.state.atkMove1}
        />

        <Heading>Charge Move</Heading>

        <PickerSelect
          hideDoneBar={true}
          hideIcon={true}
          items={atk.moves.charge.map(createMoveItem)}
          onValueChange={atkMove2 => this.setState({ atkMove2 })}
          value={this.state.atkMove2}
        />

        <Heading>IV: 100%</Heading>
        <Heading>LVL: 40</Heading>
      </View>
    )
  }

  renderDefenderOptions() {
    const { def } = this.state

    if (!def) {
      return null;
    }

    return (
      <View>
        <Heading>Quick Move</Heading>

        <PickerSelect
          hideDoneBar={true}
          hideIcon={true}
          items={def.moves.quick.map(createMoveItem)}
          onValueChange={defMove1 => this.setState({ defMove1 })}
          value={this.state.defMove1}
        />

        <Heading>Charge Move</Heading>

        <PickerSelect
          hideDoneBar={true}
          hideIcon={true}
          items={def.moves.charge.map(createMoveItem)}
          onValueChange={defMove2 => this.setState({ defMove2 })}
          value={this.state.defMove2}
        />

        <Heading>IV: 100%</Heading>
        <Heading>LVL: 40</Heading>
      </View>
    )
  }

  handleChooseYourPokemon() {
    const onSelectPokemon = pokemon => this.setState({
      def: pokemon,
      defMove1: pokemon.moves.quick[0],
      defMove2: pokemon.moves.charge[0],
    });
    this.props.navigation.navigate('Modal', { onSelectPokemon });
  }

  renderOpponent() {
    if (this.state.def) {
      return (
        <PokemonListCard
          navigation={this.props.navigation}
          onPress={() => false}
          pokemon={this.state.def}
        />
      )
    }

    return (
      <Button
        color="#23238E"
        title="Select Pokemon"
        onPress={this.handleChooseYourPokemon.bind(this)}
      />
    )

    return (
      <AutoComplete
        pokemon={store.getPokemons()}
        onSelect={def => this.setState({ def })}
      />
    )
  }

  renderOptions() {
    // TODO iv, level, weather, isRaid
    return null;
  }

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
          {this.renderOpponent()}
          {this.renderDefenderOptions()}
        </View>

        <View style={styles.section}>
          <Heading>Raid Battle</Heading>

          <Switch
            value={this.state.isRaid}
            onValueChange={() => this.setState({ isRaid: !this.state.isRaid })}
          />

          <Heading>Weather</Heading>

          <PickerSelect
            hideDoneBar={true}
            hideIcon={true}
            items={WEATHER}
            onValueChange={weather => this.setState({ weather })}
            value={this.state.weather}
          />
        </View>

        <View style={styles.section}>
          {(
            this.state.atk &&
            this.state.atkMove1 &&
            this.state.atkMove2 &&
            this.state.def &&
            this.state.defMove1 &&
            this.state.defMove2
          ) && (
            <Button
              accessibilityLabel="Battle this Pokemon"
              color="#801515"
              title="Battle"
              onPress={() => this.props.onSelect(this.state)}
            />
          )}
        </View>
      </View>
    );
  }
}
