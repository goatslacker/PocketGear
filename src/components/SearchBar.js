/* @flow */

import React, { PureComponent } from 'react';
import {
  Animated,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FilterToggle from './FilterToggle';

const LOLLIPOP = 21;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Platform.OS === 'ios' ? 0 : 8,
    marginBottom: 0,
  },

  bar: {
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    borderColor: 'rgba(0, 0, 0, 0.16)',
    borderWidth:
      Platform.OS === 'android' && Platform.Version < LOLLIPOP
        ? StyleSheet.hairlineWidth
        : 0,
    borderRadius: Platform.OS === 'ios' ? 0 : 2,
  },

  icon: {
    backgroundColor: 'transparent',
    color: 'rgba(0, 0, 0, .32)',
    margin: 14,
  },

  search: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  touchable: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    height:
      Platform.OS === 'android' && Platform.Version >= LOLLIPOP
        ? StyleSheet.hairlineWidth
        : 0,
  },

  row: {
    height: Platform.OS === 'ios' ? 44 : 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },

  toggles: {
    borderRadius: 0,
    ...Platform.select({
      ios: null,
      default: {
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
      },
    }),
  },

  input: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: '#000',
    flex: 1,
    margin: 0,
    paddingVertical: 0,
    paddingRight: 8,
    ...Platform.select({
      ios: {
        paddingLeft: 28,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        margin: 8,
        height: 28,
      },
      default: {
        paddingLeft: 48,
        height: 48,
      },
    }),
  },
});

type Props<T> = {
  onChangeText: string => void,
  onFocus?: Function,
  onBlur?: Function,
  placeholder: string,
  value: string,
  toggles: Array<T>,
  onChangeToggle: T => void,
  style?: any,
};

export default class SearchBar<T: *> extends PureComponent<Props<T>, State> {
  static HEIGHT = Platform.OS === 'ios' ? 64 : 56;

  _handleClearPress = () => {
    this.props.onChangeText('');
  };

  render() {
    const {
      onChangeText,
      onFocus,
      onBlur,
      placeholder,
      value,
      style,
      ...rest
    } = this.props;

    const bar = Platform.OS === 'android' && {
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    };

    return (
      <View {...rest} style={[styles.container, style]}>
        <Animated.View style={[styles.bar, bar]}>
          <TextInput
            autoCorrect={false}
            style={styles.input}
            placeholder={placeholder}
            value={value}
            placeholderTextColor="rgba(0, 0, 0, .32)"
            selectionColor="rgba(0, 0, 0, .32)"
            underlineColorAndroid="transparent"
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            returnKeyType="done"
          />
          <Icon
            style={[styles.icon, styles.search]}
            name="search"
            size={Platform.OS === 'ios' ? 16 : 24}
          />
          {this.props.value ? (
            <TouchableOpacity
              onPress={this._handleClearPress}
              style={styles.touchable}
            >
              <Icon
                style={styles.icon}
                name="cancel"
                size={Platform.OS === 'ios' ? 16 : 24}
              />
            </TouchableOpacity>
          ) : null}
        </Animated.View>
        {this.props.toggles && (
          <Animated.View
            style={[styles.bar, styles.toggles]}
            pointerEvents={'auto'}
          >
            <Animated.View style={styles.separator} />
            <Animated.View style={styles.row}>
              {this.props.toggles.map(toggle => (
                <FilterToggle
                  key={toggle.name}
                  active={toggle.active}
                  label={toggle.label}
                  onPress={() => this.props.onChangeToggle(toggle)}
                />
              ))}
            </Animated.View>
          </Animated.View>
        )}
      </View>
    );
  }
}
