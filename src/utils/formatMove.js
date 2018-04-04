import capitalize from './capitalize';

export default function formatMove(moveName) {
  return capitalize(
    moveName
      .replace(/_FAST$/, '')
      .toLowerCase()
      .replace(/_([a-z])/g, (_, b) => ` ${b.toUpperCase()}`)
  );
}
