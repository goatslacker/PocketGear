/* @flow */

import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  heading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
    marginVertical: 4,
  },
});

type Props = {
  style?: any,
  children?: any,
};

const levels = [, 1, 1.25, 1.5, 2, 4];

function getLevelStyles(level) {
  if (!level) {
    return {};
  }

  const div = levels[level];

  return {
    fontSize: 24 / div,
    lineHeight: 36 / div,
    marginVertical: Math.floor(4 / div),
  };
}

export default function Heading(props: Props) {
  return (
    <Text
      {...props}
      style={[styles.heading, props.style, getLevelStyles(props.level)]}
    >
      {props.children}
    </Text>
  );
}

Heading.defaultProps = {
  level: 3,
};
