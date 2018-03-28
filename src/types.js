/* @flow */

export type PokemonType =
  | 'Bug'
  | 'Dark'
  | 'Dragon'
  | 'Electric'
  | 'Fairy'
  | 'Fighting'
  | 'Fire'
  | 'Flying'
  | 'Ghost'
  | 'Grass'
  | 'Ground'
  | 'Ice'
  | 'Normal'
  | 'Poison'
  | 'Psychic'
  | 'Rock'
  | 'Steel'
  | 'Water';

export type EvolutionItem =
  | 'Dragon Scale'
  | "King's Rock"
  | 'Metal Coat'
  | 'Sun Stone'
  | 'Up-Grade';

export type PokemonID = number;

export type Pokemon = {|
  id: PokemonID,
  name: string,
  type1: PokemonType,
  type2: PokemonType,
  moves: {
    quick: Array<string>,
    charge: Array<string>,
  },
  stats: {
    stamina: number,
    attack: number,
    defense: number,
  },
  evolutionBranch?: Array<{
    evolution: string,
    candyCost: number,
  }>,
  kmBuddyDistance?: number,
  captureRate: number,
  fleeRate: number,
  height: number,
  weight: number,
|};

export type TypeChart = {|
  name: PokemonType,
  super_effective: Array<PokemonType>,
  not_very_effective: Array<PokemonType>,
|};

export type Move = {|
  Name: string,
  Type: PokemonType,
  Power?: number,
  DurationMs: number,
  Energy: number,
|};
