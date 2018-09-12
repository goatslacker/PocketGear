/* @flow */

import React from 'react';
import { Button, FlatList, Image, Text, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import formatMove from '../utils/formatMove';
import store from '../store';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  container: {
    paddingTop: 12,
  },

  replay: {
    marginTop: 16,
    marginBottom: -4,
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

  tinySection: {
    marginVertical: 8,
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

  image2: {
    height: 72,
    resizeMode: 'contain',
  },

  meta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    color: '#222',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
  },

  soft: {
    color: '#666',
  },
});

function renderItem({ item }, results) {
  const sprite = store.getSprite(results[item.p].id);

  if (item.m === '@FAINT') {
    return (
      <View style={[styles.item, styles.row]}>
        <Image source={sprite} style={[styles.image]} />

        <Text>Faints</Text>
      </View>
    );
  }

  if (item.m === '@SWITCH') {
    return (
      <View style={[styles.item, styles.row]}>
        <Image source={sprite} style={[styles.image]} />

        <Text>Switches into Battle</Text>
      </View>
    );
  }

  if (item.m === '@TIME_OUT') {
    return (
      <View style={[styles.item, styles.row]}>
        <Text style={[styles.dmg, styles.center]}>Timed Out</Text>
      </View>
    );
  }

  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Image source={sprite} style={[styles.image]} />

        <View>
          <Text style={styles.dmg}>{formatMove(item.m)}</Text>
          <Text style={styles.time}>{item.ms / 1000}s</Text>
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
  );
}

function Table({ rows }) {
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
  );
}

export default function BattleResults({ onDone, results }) {
  let atkHP = results.atk.hp;
  let defHP = results.def.hp;
  const log = results.log.map(row => {
    if (row.p === 'atk') {
      defHP -= row.dmg;
      row.hp = defHP;
    }
    if (row.p === 'def') {
      atkHP -= row.dmg;
      row.hp = atkHP;
    }

    row.key = row.p + row.ms + row.m;

    return row;
  });

  const atkSprite = store.getSprite(results.atk.id);
  const defSprite = store.getSprite(results.def.id);

  return (
    <View style={styles.container}>
      <Table
        rows={[
          {
            label: 'Winner',
            text: formatMove(results[results.winner].name),
          },
          {
            label: 'Time Elapsed',
            text: `${results.timeElapsed / 1000}s`,
          },
          {
            label: 'Time Remaining',
            text: `${results.timeRemaining / 1000}s`,
          },
        ]}
      />

      <View style={styles.replay}>
        <Button color="#df4848" title="Replay Battle" onPress={onDone} />
      </View>

      <View style={styles.section}>
        <View style={[styles.meta]}>
          <View>
            <Text style={[styles.name]}>{formatMove(results.atk.name)}</Text>
            <Heading level={4} style={styles.soft}>
              {formatMove(results.atk.moves[0])} and {formatMove(results.atk.moves[1])}
            </Heading>
          </View>
          <Image style={styles.image2} source={atkSprite} />
        </View>

        <Table
          rows={[
            {
              label: 'CP',
              text: results.atk.cp,
            },
            {
              label: 'HP',
              text: results.atk.hp,
            },
            {
              label: 'Damage Taken',
              text: `-${results.atk.dmgTaken}hp`,
            },
            {
              label: 'Damage Dealt',
              text: `${results.atk.dmgDealt}dmg`,
            },
          ]}
        />

        <View style={[styles.meta]}>
          <View>
            <Text style={[styles.name]}>{formatMove(results.def.name)}</Text>
            <Heading level={4} style={styles.soft}>
              {formatMove(results.def.moves[0])} and {formatMove(results.def.moves[1])}
            </Heading>
          </View>
          <Image style={styles.image2} source={defSprite} />
        </View>

        <Table
          rows={[
            {
              label: 'CP',
              text: results.def.cp,
            },
            {
              label: 'HP',
              text: results.def.hp,
            },
            {
              label: 'Damage Taken',
              text: `-${results.def.dmgTaken}hp`,
            },
            {
              label: 'Damage Dealt',
              text: `${results.def.dmgDealt}dmg`,
            },
          ]}
        />
      </View>

      <Heading level={1} style={styles.center}>Battle Log</Heading>

      <FlatList
        data={log}
        keyExtractor={item => item.key}
        renderItem={item => renderItem(item, results)}
      />
    </View>
  );
}
