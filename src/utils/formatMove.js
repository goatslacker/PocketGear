import ucFirst from './ucFirst';

export default function formatMove(moveName) {
  return ucFirst(
    moveName
      .replace(/_FAST$/, '')
      .toLowerCase()
      .replace(/_([a-z])/g, (_, b) => ` ${b.toUpperCase()}`)
  )
}

