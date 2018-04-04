/* @flow */

import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import PokemonChooser from './PokemonChooser';
import PokemonInfo from './PokemonInfo';
import PokeModal from './PokeModal';
import Arena from './Arena';

import { Font } from 'expo';

const Home = StackNavigator(
  {
    Main: { screen: PokemonChooser },
    Info: { screen: PokemonInfo },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
  }
);

const Root = StackNavigator(
  {
    Main: {
      screen: Home,
    },
    Modal: {
      screen: PokeModal,
    },
    Arena: {
      screen: Arena,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

// TODO remove the expo font loading before publish
export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
    };
  }

  componentDidMount() {
    Font.loadAsync({
      EvilIcons: require('react-native-vector-icons/Fonts/EvilIcons.ttf'),
      'Material Icons': require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
    }).then(() => this.setState({ fontLoaded: true }));
  }

  render() {
    if (!this.state.fontLoaded) {
      return null;
    }

    return <Root onNavigationStateChange={() => {}} />;
  }
}
