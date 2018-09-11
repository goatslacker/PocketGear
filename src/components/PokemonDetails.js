/* @flow */

import React, { PureComponent } from 'react';
import difference from 'lodash/difference';
import { Image, View, Text, ScrollView, StyleSheet } from 'react-native';

import Attack from './Attack';
import Evolution from './Evolution';
import Heading from './Heading';
import PokemonTypeLabel from './PokemonTypeLabel';
import ProgressBar from './ProgressBar';
import formatMove from '../utils/formatMove';
import getQuickAttacks from '../utils/getQuickAttacks';
import getResistantToTypes from '../utils/getResistantToTypes';
import getSpecialAttacks from '../utils/getSpecialAttacks';
import getStrongAgainstTypes from '../utils/getStrongAgainstTypes';
import getWeakAgainstTypes from '../utils/getWeakAgainstTypes';
import store from '../store';
import type { Pokemon, PokemonID, Move } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 16,
  },

  item: {
    marginVertical: 8,
  },

  text: {
    color: '#222',
    fontFamily: 'Montserrat',
    fontSize: 13,
  },

  strong: {
    fontFamily: 'Montserrat-SemiBold',
  },

  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },

  wrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: -4,
  },

  center: {
    alignItems: 'center',
  },

  measurement: {
    width: 120,
  },

  label: {
    width: 120,
  },

  amount: {
    textAlign: 'right',
    width: 80,
  },

  image: {
    marginHorizontal: 8,
    height: 72,
    resizeMode: 'contain',
  },

  types: {
    flexDirection: 'row',
    marginHorizontal: -2,
  },

  meta: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  label2: {
    color: '#222',
    fontFamily: 'Montserrat',
    width: 160,
  },

  name: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    marginVertical: 4,
  },

  basic: {
    flex: 1,
  },
});

type Props = {
  pokemon: Pokemon,
  style?: any,
  navigation: Object,
};

export default class PokemonDetails extends PureComponent<Props, void> {
  _goToPokemon = (pokemonId: PokemonID) => () => {
    this.props.navigation.navigate('Info', {
      pokemonId,
    });
  };

  _renderStat = (
    type: string,
    ratio: number,
    amount: string | number,
    fill: string
  ) => {
    return (
      <View style={[styles.row, styles.center]}>
        <Text style={[styles.text, styles.label]}>{type}</Text>
        <ProgressBar ratio={ratio || 0} fillColor={fill} />
        <Text style={[styles.text, styles.amount]}>{amount}</Text>
      </View>
    );
  };

  _renderAttack = (move: Move) => {
    return (
      <Attack
        key={move.Name}
        style={styles.row}
        move={move}
        types={this.props.pokemon.types}
      />
    );
  };

  render() {
    const { pokemon } = this.props;
    const maxCP = store.getMaxCP(pokemon);
    const maxHP = store.getMaxHP(pokemon);
    const maxValues = store.getCPValues();
    const quickAttacks = getQuickAttacks(pokemon);
    const specialAttacks = getSpecialAttacks(pokemon);
    const strongAgainstAll = getStrongAgainstTypes(pokemon);
    const weakAgainstAll = getWeakAgainstTypes(pokemon);
    const resistantToAll = getResistantToTypes(pokemon);
    const strongAgainst = difference(strongAgainstAll, weakAgainstAll);
    const weakAgainst = difference(weakAgainstAll, strongAgainstAll);
    const resistantTo = difference(resistantToAll, [
      ...weakAgainst,
      ...strongAgainst,
    ]);
    const sprite = store.getSprite(pokemon.id);

    return (
      <ScrollView {...this.props} style={[styles.container, this.props.style]}>
        <View style={[styles.row, styles.meta]}>
          <View style={styles.basic}>
            <Text style={[styles.label2, styles.name]}>
              {formatMove(pokemon.name)}
            </Text>
            <View style={styles.types}>
              {pokemon.types.map(type => (
                <PokemonTypeLabel key={type} type={type} />
              ))}
            </View>
          </View>
          <Image style={styles.image} source={sprite} />
        </View>

        <View style={styles.content}>
          <View style={styles.item}>
            <Heading selectable>Stats</Heading>
            {this._renderStat(
              'Max CP',
              maxCP / maxValues.max_cp,
              maxCP,
              '#e57373'
            )}
            {this._renderStat(
              'Max HP',
              maxHP / maxValues.max_hp,
              maxHP,
              '#66d073'
            )}
            {this._renderStat(
              'Attack',
              pokemon.stats.attack / maxValues.attack,
              pokemon.stats.attack,
              '#ff8a65'
            )}
            {this._renderStat(
              'Defense',
              pokemon.stats.defense / maxValues.defense,
              pokemon.stats.defense,
              '#9575cd'
            )}
            {this._renderStat(
              'Stamina',
              pokemon.stats.stamina / maxValues.stamina,
              pokemon.stats.stamina,
              '#5499c7'
            )}
          </View>

          <View style={styles.item}>
            <Heading selectable>Types</Heading>
            {strongAgainst.length ? (
              <View style={[styles.row, styles.item]}>
                <Text style={[styles.text, styles.label]}>Strong against</Text>
                <View style={styles.wrap}>
                  {strongAgainst.map(type => (
                    <PokemonTypeLabel key={type} type={type} />
                  ))}
                </View>
              </View>
            ) : null}
            {resistantTo.length ? (
              <View style={[styles.row, styles.item]}>
                <Text style={[styles.text, styles.label]}>Resistant to</Text>
                <View style={styles.wrap}>
                  {resistantTo.map(type => (
                    <PokemonTypeLabel key={type} type={type} />
                  ))}
                </View>
              </View>
            ) : null}
            {weakAgainst.length ? (
              <View style={[styles.row, styles.item]}>
                <Text style={[styles.text, styles.label]}>Weak against</Text>
                <View style={styles.wrap}>
                  {weakAgainst.map(type => (
                    <PokemonTypeLabel key={type} type={type} />
                  ))}
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.item}>
            <Heading selectable>Moves</Heading>
            {quickAttacks.map(this._renderAttack)}
            {specialAttacks.map(this._renderAttack)}
          </View>

          <View style={styles.item}>
            <Heading selectable>Vitals</Heading>
            <View style={[styles.row, styles.center]}>
              <Text
                selectable
                style={[styles.text, styles.strong, styles.measurement]}
              >
                Height
              </Text>
              <Text selectable style={styles.text}>
                {pokemon.height} m
              </Text>
            </View>
            <View style={[styles.row, styles.center]}>
              <Text
                selectable
                style={[styles.text, styles.strong, styles.measurement]}
              >
                Weight
              </Text>
              <Text selectable style={styles.text}>
                {pokemon.weight} kg
              </Text>
            </View>
            <View style={[styles.row, styles.center]}>
              <Text
                selectable
                style={[styles.text, styles.strong, styles.measurement]}
              >
                Capture Rate
              </Text>
              <Text selectable style={styles.text}>
                {Math.min(100, pokemon.captureRate * 100)}%
              </Text>
            </View>
            <View style={[styles.row, styles.center]}>
              <Text
                selectable
                style={[styles.text, styles.strong, styles.measurement]}
              >
                Flee Rate
              </Text>
              <Text selectable style={styles.text}>
                {(pokemon.fleeRate || 0) * 100}%
              </Text>
            </View>
            {pokemon.kmBuddyDistance ? (
              <View style={[styles.row, styles.center]}>
                <Text
                  selectable
                  style={[styles.text, styles.strong, styles.measurement]}
                >
                  Buddy Distance
                </Text>
                <Text selectable style={styles.text}>
                  {pokemon.kmBuddyDistance} km
                </Text>
              </View>
            ) : null}
          </View>

          {pokemon.evolutionBranch ? (
            <View style={styles.item}>
              <Evolution
                style={styles.item}
                pokemon={pokemon}
                navigation={this.props.navigation}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}
