/* @flow */

import React from 'react';
import { Button, FlatList, Image, Text, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import PokemonListCard from './PokemonListCard';
import formatMove from '../utils/formatMove';
import shortenMove from '../utils/shortenMove';
import store from '../store';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  dmg: {
    alignItems: 'center',
    fontWeight: 'bold',
  },

  time: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },

  center: {
    textAlign: 'center',
  },

  results: {
    marginBottom: 60,
  },

  section: {
    marginVertical: 20,
  },

  text: {
    color: '#222',
    fontFamily: 'Montserrat',
    fontSize: 13,
  },

  label: {
    color: '#222',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    width: 120,
  },

  image: {
    resizeMode: 'contain',
    height: 60,
    width: 60,
  },

  item: {
    marginBottom: 12,
  },
});

function renderItem({ item }, results) {
  const pokemon = store.getPokemonByName(results[item.p].name);
  const subtitle= `HP ${item.hp}`
  const sprite = store.getSprite(pokemon.id);

  return (
    <View style={styles.item}>

      <View style={styles.row}>
        <View>
          <Image
            source={sprite}
            style={[styles.image]}
          />
        </View>

        <View>
          <Text style={styles.dmg}>
            {formatMove(item.m)}
          </Text>
          <Text style={styles.time}>
            {item.ms / 1000}s
          </Text>
        </View>

        <View>
          <Text>
            {item.p} {item.dmg}dmg
          </Text>
          <Text>
            {item.p === 'atk' ? 'def' : 'atk'} {item.hp}hp
          </Text>
        </View>
      </View>

    </View>
  )
}

function Table({
  rows,
}) {
  return (
    <View>
      {rows.map(row => (
        <View key={row.label} style={styles.row}>
          <Text selectable style={styles.label}>
            {row.label}
          </Text>
          <Text selectable style={styles.text}>
            {row.text}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default function BattleResults({
  onDone,
  results,
}) {
  const pokemon = store.getPokemonByName(results[results.winner].name)

  let atkHP = results.atk.hp
  let defHP = results.def.hp
  const log = results.log.map(row => {
    if (row.p === 'atk') {
      defHP -= row.dmg
      row.hp = defHP
    }
    if (row.p === 'def') {
      atkHP -= row.dmg
      row.hp = atkHP
    }

    row.key = row.p + row.ms

    return row
  })

  return (
    <View style={styles.results}>
      <Heading level={1}>Winner</Heading>

      <PokemonListCard
        pokemon={pokemon}
        subtitle={results[results.winner].moves.map(formatMove).join(' & ')}
        toptext={results.winner}
      />

      <Heading level={1}>Battle Stats</Heading>

      <View>
        <Table rows={[
          {
            label: 'Time Elapsed',
            text: `${results.timeElapsed / 1000}s`,
          },
          {
            label: 'Damage Taken',
            text: `-${results.atk.dmgTaken}hp`,
          },
          {
            label: 'Damage Dealt',
            text: `${results.atk.dmgDealt}dmg`,
          },
        ]} />
      </View>

      <View>
        <View style={styles.row}>
          <View>
            <Heading style={styles.center}>
              {formatMove(results.atk.name)}
            </Heading>
            <Text style={styles.center}>
              {results.atk.moves.map(formatMove).join(' & ')}
            </Text>
            <Table rows={[
              {
                label: 'CP',
                text: results.atk.cp,
              },
              {
                label: 'HP',
                text: results.atk.hp,
              },
            ]} />
          </View>

          <View>
            <Heading style={styles.center}>
              {formatMove(results.def.name)}
            </Heading>
            <Text style={styles.center}>
              {results.def.moves.map(formatMove).join(' & ')}
            </Text>
            <Table rows={[
              {
                label: 'CP',
                text: results.def.cp,
              },
              {
                label: 'HP',
                text: results.def.hp,
              },
            ]} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Button
          color="#df4848"
          title="Battle Again?"
          onPress={onDone}
        />
      </View>

      <Heading level={1}>Battle Log</Heading>

      <FlatList
        data={log}
        keyExtractor={item => item.key}
        renderItem={item => renderItem(item, results)}
      />
    </View>
  )
}
