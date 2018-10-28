import React, { PureComponent } from 'react';
import { Image, View, ScrollView, StyleSheet } from 'react-native';

import Appbar from './Appbar';
import Attack from './Attack';
import TouchableItem from './TouchableItem';
import getQuickAttacks from '../utils/getQuickAttacks';
import getSpecialAttacks from '../utils/getSpecialAttacks';
import store from '../store';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  image: {
    marginHorizontal: 8,
    height: 72,
    resizeMode: 'contain',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});

export default class MovesModal extends PureComponent {
  selectMove(move) {
    const { navigation } = this.props;
    const { params } = navigation.state;
    params.onSelectMove(move);
    navigation.goBack();
  }

  render() {
    const { navigation } = this.props;
    const { params } = navigation.state;

    const pokemon = store.getPokemonByID(params.id);
    const attacks =
      params.moves === 'quick'
        ? getQuickAttacks(pokemon)
        : getSpecialAttacks(pokemon);
    const sprite = store.getSprite(pokemon.id);

    return (
      <ScrollView style={styles.container}>
        <Appbar navigation={this.props.navigation} close>
          Select a Move
        </Appbar>
        <View style={styles.center}>
          <Image style={styles.image} source={sprite} />
        </View>
        <View>
          {attacks.map((move) => {
            return (
              <TouchableItem
                key={move.Name}
                onPress={() => this.selectMove(move)}
                activeOpacity={0.7}
                style={styles.row}
              >
                <Attack move={move} types={pokemon.types} />
              </TouchableItem>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}
