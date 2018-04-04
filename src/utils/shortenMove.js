import formatMove from './formatMove';

export default function shortenMove(txt) {
  return formatMove(txt).replace(/[a-z ]/g, '');
}
