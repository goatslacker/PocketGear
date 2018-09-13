/* @flow */

import React from 'react';
import { Button, FlatList, Image, Text, View, StyleSheet } from 'react-native';

import Heading from './Heading';
import ProgressBar from './ProgressBar';
import formatMove from '../utils/formatMove';
import store from '../store';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },

  right: {
    textAlign: 'right',
  },

  basic: {
    flex: 1,
  },

  container: {
    paddingTop: 12,
  },

  replay: {
    marginTop: 16,
    marginBottom: -4,
  },

  dmg: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  time: {
    color: '#999',
    fontSize: 12,
  },

  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
  },

  center: {
    textAlign: 'center',
  },

  section: {
    marginVertical: 20,
  },

  text: {
    color: '#222',
    fontFamily: 'Montserrat',
    fontSize: 13,
    textAlign: 'right',
  },

  label: {
    color: '#222',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    width: 120,
  },

  image: {
    resizeMode: 'contain',
    marginRight: 12,
    height: 60,
    width: 60,
  },

  atk: {
    backgroundColor: '#fc8080',
  },

  def: {
    backgroundColor: '#8080fc',
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
    justifyContent: 'flex-start',
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
  const style = [styles.image, styles[item.p]];

  if (item.m === '@FAINT') {
    return (
      <View style={[styles.item, styles.row]}>
        <Image source={sprite} style={style} />

        <Text>Faints</Text>
      </View>
    );
  }

  if (item.m === '@SWITCH') {
    return (
      <View style={[styles.item, styles.row]}>
        <Image source={sprite} style={style} />

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
        <Image source={sprite} style={style} />

        <View>
          <Text style={styles.dmg}>{formatMove(item.m)}</Text>
          <Text style={styles.time}>{item.ms / 1000}s</Text>
        </View>

        <View style={styles.basic}>
          <Text style={styles.right}>
            {item.dmg}dmg
          </Text>
          <Text style={styles.right}>
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
          {row.middle && (
            <View style={styles.middle}>
              {row.middle}
            </View>
          )}
          <Text selectable style={[styles.basic, styles.text]}>
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
            text: `${formatMove(results[results.winner].name)} (${results.winner})`,
          },
          {
            label: 'Time Elapsed',
            text: `${results.timeElapsed / 1000}s`,
          },
          {
            label: 'Damage',
            middle: (
              <ProgressBar
                ratio={results.atk.dmgDealt / results.def.hp}
                fillColor="#e57373"
              />
            ),
            text: results.atk.dmgDealt,
          },
          {
            label: 'Time Remaining',
            middle: (
              <ProgressBar
                ratio={results.timeRemaining / (results.timeElapsed + results.timeRemaining)}
                fillColor="#5499c7"
              />
            ),
            text: `${results.timeRemaining / 1000}s`,
          },
        ]}
      />

      <View style={styles.replay}>
        <Button color="#df4848" title="Replay Battle" onPress={onDone} />
      </View>

      <View style={styles.section}>
        <View style={[styles.meta]}>
          <Image style={[styles.image, styles.atk]} source={atkSprite} />
          <View>
            <Text style={[styles.name]}>{formatMove(results.atk.name)}</Text>
            <Heading level={4} style={styles.soft}>
              {formatMove(results.atk.moves[0])} and{' '}
              {formatMove(results.atk.moves[1])}
            </Heading>
          </View>
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

        <View style={[styles.meta, { marginTop: 16 }]}>
          <Image style={[styles.image, styles.def]} source={defSprite} />
          <View>
            <Text style={[styles.name]}>{formatMove(results.def.name)}</Text>
            <Heading level={4} style={styles.soft}>
              {formatMove(results.def.moves[0])} and{' '}
              {formatMove(results.def.moves[1])}
            </Heading>
          </View>
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

      <Heading level={1} style={styles.center}>
        Battle Log
      </Heading>

      <FlatList
        data={log}
        keyExtractor={item => item.key}
        renderItem={item => renderItem(item, results)}
      />
    </View>
  );
}
