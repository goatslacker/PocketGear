/* @flow */

import React from 'react';
import { Button, FlatList, Image, Text, View, StyleSheet } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import TouchableItem from './TouchableItem';
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
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

  tiny: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },

  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 160,
  },

  center: {
    textAlign: 'center',
  },

  mb: {
    marginBottom: 10,
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

  details: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 120,
  },

  img: {
    height: 80,
    width: 80,
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

  gold: {
    color: '#daa520',
  },
});

function renderDetails(item, results) {
  const atk = item.p === 'atk' ? item.a : item.d;
  const def = item.p === 'def' ? item.a : item.d;

  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <Image source={store.getSprite(results.atk.id)} style={styles.img} />
        <ProgressBar ratio={atk.e / 100} fillColor="#fc8080" />
        <Text style={styles.tiny}>Energy {atk.e}</Text>
        <ProgressBar ratio={atk.h / results.atk.hp} fillColor="#fc8080" />
        <Text style={styles.tiny}>HP {atk.h}</Text>
      </View>

      <View style={styles.details}>
        <Image source={store.getSprite(results.def.id)} style={styles.img} />
        <ProgressBar ratio={def.e / 200} fillColor="#8080fc" />
        <Text style={styles.tiny}>Energy {def.e}</Text>
        <ProgressBar ratio={def.h / results.def.hp} fillColor="#8080fc" />
        <Text style={styles.tiny}>HP {def.h}</Text>
      </View>
    </View>
  );
}

class RowItem extends React.Component {
  constructor() {
    super();

    this.state = {
      showDetails: false,
    };
  }

  render() {
    const { item, results } = this.props;

    const sprite = store.getSprite(results[item.p].id);
    const style = [styles.image, styles[item.p]];

    if (item.m === '@DODGE') {
      return (
        <View style={[styles.item, styles.row]}>
          <Image source={sprite} style={style} />

          <Text>Dodged</Text>
        </View>
      );
    }

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
      <TouchableItem
        activeOpacity={0.85}
        onPress={() => this.setState({ showDetails: !this.state.showDetails })}
        style={styles.item}
      >
        <View style={styles.row}>
          <Image source={sprite} style={style} />

          <View>
            <Text style={styles.dmg}>{formatMove(item.m)}</Text>
            <Text style={styles.time}>{item.ms / 1000}s</Text>
          </View>

          <View style={styles.basic}>
            <Text style={styles.right}>{item.dmg}</Text>
          </View>
        </View>

        {this.state.showDetails && renderDetails(item, results)}
      </TouchableItem>
    );
  }
}

function renderItem({ item }, results) {
  return <RowItem item={item} results={results} />;
}

function Table({ rows }) {
  return (
    <View>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text selectable style={styles.label}>
            {row.label}
          </Text>
          {row.middle && <View style={styles.middle}>{row.middle}</View>}
          <Text selectable style={[styles.basic, styles.text]}>
            {row.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function BattleResults({ onDone, results }) {
  const log = results.log.map((row) => {
    row.key = row.p + row.ms + row.m;
    return row;
  });

  const atkSprite = store.getSprite(results.atk.id);
  const defSprite = store.getSprite(results.def.id);

  const winner = <EvilIcons name="trophy" size={24} style={styles.gold} />;

  return (
    <View style={styles.container}>
      <Table
        rows={[
          {
            label: 'Winner',
            text: `${formatMove(results[results.winner].name)} (${
              results.winner
            })`,
          },
          {
            label: 'Time Elapsed',
            text: `${results.timeElapsed / 1000}s`,
          },
          {
            label: 'Time Remaining',
            middle: (
              <ProgressBar
                ratio={
                  results.timeRemaining /
                  (results.timeElapsed + results.timeRemaining)
                }
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
        <View style={styles.row}>
          <View style={[styles.meta]}>
            <Image style={[styles.image, styles.atk]} source={atkSprite} />
            <View>
              <View style={styles.meta}>
                <Text style={[styles.name]}>
                  {formatMove(results.atk.name)}
                </Text>
                {results.winner === 'atk' && winner}
              </View>
              <Heading level={4} style={styles.soft}>
                {formatMove(results.atk.moves[0])} and{' '}
                {formatMove(results.atk.moves[1])}
              </Heading>
            </View>
          </View>
          <TouchableItem onPress={onDone}>
            <EvilIcons name="gear" size={24} style={styles.soft} />
          </TouchableItem>
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
              label: 'Health',
              middle: (
                <ProgressBar
                  ratio={
                    (results.atk.hp - results.atk.dmgTaken) / results.atk.hp
                  }
                  fillColor="#66d073"
                />
              ),
              text: results.atk.hp - results.atk.dmgTaken,
            },
          ]}
        />

        <View style={styles.row}>
          <View style={[styles.meta, { marginTop: 16 }]}>
            <Image style={[styles.image, styles.def]} source={defSprite} />
            <View>
              <View style={styles.meta}>
                <Text style={[styles.name]}>
                  {formatMove(results.def.name)}
                </Text>
                {results.winner === 'def' && winner}
              </View>
              <Heading level={4} style={styles.soft}>
                {formatMove(results.def.moves[0])} and{' '}
                {formatMove(results.def.moves[1])}
              </Heading>
            </View>
          </View>
          <TouchableItem onPress={onDone}>
            <EvilIcons name="gear" size={24} style={styles.soft} />
          </TouchableItem>
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
              label: 'Damage',
              middle: (
                <ProgressBar
                  ratio={results.def.dmgDealt / results.atk.hp}
                  fillColor="#e57373"
                />
              ),
              text: results.def.dmgDealt,
            },
            {
              label: 'Health',
              middle: (
                <ProgressBar
                  ratio={
                    (results.def.hp - results.def.dmgTaken) / results.def.hp
                  }
                  fillColor="#66d073"
                />
              ),
              text: results.def.hp - results.def.dmgTaken,
            },
          ]}
        />
      </View>

      <Heading level={1} style={[styles.center, styles.mb]}>
        Battle Log
      </Heading>

      <View style={styles.section}>
        <FlatList
          data={log}
          keyExtractor={(item) => item.key}
          renderItem={(item) => renderItem(item, results)}
        />
      </View>
    </View>
  );
}
