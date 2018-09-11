/* @flow */

import React, { PureComponent } from 'react';
import defenderProfile from 'pokemagic/defenderProfile';
import dex from 'pokemagic/dex';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

import More from './More';
import MovesetPicker from './MovesetPicker';
import PokemonList from './PokemonList';
import PokemonListCard from './PokemonListCard';
import ProgressBar from './ProgressBar';
import formatMove from '../utils/formatMove';
import getBestMoveset from '../utils/getBestMoveset';
import shortenMove from '../utils/shortenMove';
import store from '../store';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
  },

  content: {
    padding: 4,
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
  },

  row4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  text: {
    color: '#888',
    fontFamily: 'Montserrat',
    fontSize: 12,
  },

  center: {
    alignItems: 'center',
  },

  wide: {
    marginTop: 8,
    width: 170,
  },

  label: {
    marginRight: 4,
    width: 40,
  },

  amount: {
    textAlign: 'right',
    width: 50,
  },
});

function bestDPS(results) {
  if (bestDPS.cache) {
    return bestDPS.cache;
  }

  bestDPS.cache = Math.max.apply(Math.max, results.map(x => x[3]));

  return bestDPS.cache;
}

function bestTDO(results) {
  if (bestTDO.cache) {
    return bestTDO.cache;
  }

  bestTDO.cache = Math.max.apply(Math.max, results.map(x => x[4]));

  return bestTDO.cache;
}

function getDefenderProfile(pokemon, quickMove, chargeMove) {
  const { counters } = defenderProfile(pokemon.name, quickMove, chargeMove, {
    filterAttackerMoveset: move => move.legacy === 0,
    numPokemon: 20,
    // TODO let you configure weather
    weather: 'EXTREME',
  });

  return counters.map(moveset => ({
    key: `${moveset.quick}/${moveset.charge}`,
    quick: moveset.quick,
    charge: moveset.charge,
    results: moveset.results.map(x => {
      const pokemon = store.getPokemonByName(x.name);
      const [quick, charge] = x.stats[0].moves;

      return [
        pokemon.id,
        quick,
        charge,
        x.stats[0].dps,
        x.stats[0].tdo,
        x.stats[0].score,
      ];
    }),
  }));
}

function getCardProps(rowData) {
  const [id, quickMove, chargeMove, dps, tdo, score] = rowData;

  const pokemon = store.getPokemonByID(id);
  const subtitle = `${formatMove(quickMove)} and ${formatMove(chargeMove)}`

  const color = store.getColor(dex.findMove(chargeMove).Type);

  return {
    pokemon,
    subtitle,
    color,
    dps,
    tdo,
    score,
  };
}

function goToBattle(defender, moveset, navigation) {
  return (attacker, rowData) => {
    const [defQuick, defCharge] = moveset.split('/');

    navigation.navigate('Arena', {
      atkId: attacker.id,
      atkQuick: rowData[1],
      atkCharge: rowData[2],
      defId: defender.id,
      defQuick,
      defCharge,
    });
  };
}

function ProgressLabel({
  color,
  label,
  ratio,
  value,
}) {
  return (
    <View style={[styles.row4, styles.center]}>
      <Text style={[styles.text, styles.label]}>{label}</Text>
      <ProgressBar ratio={ratio || 0} fillColor={color} />
      <Text style={[styles.text, styles.amount]}>{value}</Text>
    </View>
  )
}

export default class PokemonMatches extends React.Component {
  constructor(props) {
    super();

    const { pokemon } = props;

    const best = getBestMoveset(pokemon);
    const moveset = `${best.quick.Name}/${best.charge.Name}`;
    const data = getDefenderProfile(pokemon, best.quick.Name, best.charge.Name);

    this.state = { moveset, data };
  }

  changeMoveset(moveset) {
    const { pokemon } = this.props;

    if (!moveset) {
      this.setState({
        data: [],
      });
      return;
    }

    const [quick, charge] = moveset.split('/');
    const data = getDefenderProfile(pokemon, quick, charge);
    if (data) {
      this.setState({ moveset, data });
      return;
    }

    this.setState({
      data: [],
    });
  }

  render() {
    const { navigation, pokemon } = this.props;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <MovesetPicker
          onChange={moveset => this.changeMoveset(moveset)}
          pokemon={pokemon}
          value={this.state.moveset}
        />

        {this.state.data.map(({ key, quick, charge, results }) => (
          <View key={key} style={styles.row}>
            <PokemonList
              data={results}
              getCardProps={getCardProps}
              navigation={this.props.navigation}
              onPress={goToBattle(pokemon, this.state.moveset, navigation)}
            >{({
              color,
              dps,
              tdo,
              score,
            }) => (
              <View style={[styles.wide]}>
                <ProgressLabel
                  color="#9575cd"
                  label="Score"
                  ratio={score / results[0][5]}
                  value={Math.round(score)}
                />
                <ProgressLabel
                  color="#e57373"
                  label="DPS"
                  ratio={dps / bestDPS(results)}
                  value={dps}
                />
                <ProgressLabel
                  color="#5499c7"
                  label="TDO"
                  ratio={tdo / bestTDO(results)}
                  value={tdo}
                />
              </View>
            )}
            </PokemonList>
          </View>
        ))}
      </ScrollView>
    );
  }
}
