#!/usr/bin/env node

/* @flow */
/* eslint-disable import/no-commonjs */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const cleanup = require('node-cleanup');

const babelrc = path.join(__dirname, '..', '.babelrc');
const backup = fs.readFileSync(babelrc, 'utf-8').toString();

cleanup(() => {
  fs.writeFileSync(babelrc, backup);
});

fs.writeFileSync(
  babelrc,
  JSON.stringify(
    {
      presets: ['expo'],
    },
    null,
    2
  )
);

execSync(`${process.argv.slice(2).join(' ')} --reset-cache`, {
  stdio: [0, 1, 2],
});
