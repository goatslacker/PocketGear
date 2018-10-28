const sep = /[,:;]/;
const and = '&';
const move = /@([\w ]+)/;
const species = /^\+/;
const cp = /^cp/;
const hp = /^hp/;
const range = /-/;

function r(str) {
  return str.split(range);
}

function splitAndParse(query) {
  return query.split(sep).map((text) => {
    if (text === 'evolve') {
      return { special: 'evolve' };
    }

    if (text === 'alolan' || text === 'alola') {
      return { special: 'alola' };
    }

    if (text === 'mythical') {
      return { special: 'mythical' };
    }

    if (text === 'legacy') {
      return { special: 'legacy' };
    }

    if (text === 'legendary') {
      return { special: 'legendary' };
    }

    if (move.test(text)) {
      return { move: move.exec(text)[1] };
    }

    if (species.test(text)) {
      return { species: text.replace(species, '') };
    }

    const hasRange = range.test(text);

    if (cp.test(text)) {
      const naked = text.replace(cp, '');

      if (hasRange) {
        return { cp: r(naked) };
      }

      return { cp: naked };
    }

    if (hp.test(text)) {
      const naked = text.replace(hp, '');

      if (hasRange) {
        return { hp: r(naked) };
      }

      return { hp: naked };
    }

    if (hasRange) {
      return { poke: r(text) };
    }

    return { text };
  });
}

export default function parseSearchString(searchString) {
  const searches = searchString.split(and);
  const ast = searches.map((query) => splitAndParse(query));

  return (f) => {
    // The first layer of the ast is an & query so all must match
    return ast.every((res) => {
      // Second layer matches any query provided
      return res.some((obj) => {
        return f(obj);
      });
    });
  };
}
