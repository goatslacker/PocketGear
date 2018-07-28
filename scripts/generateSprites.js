const dex = require('pokemagic/dex');
const fs = require('fs');

// How to:
//
// Once you have all of the images inside assets/sprites in the format of
// pokemon_name_lowercase.png, you can run this script with node and it'll
// generate the file `src/sprites.js`.

// Sprite URL
// https://img.pokemondb.net/sprites/black-white/normal/entei.png
// https://img.pokemondb.net/sprites/sun-moon/dex/normal/raichu-alolan.png

const lines = dex.getAllPokemon().map(({ form, name }) => {
  const spritePath = `../assets/sprites/${(form || name).toLowerCase()}.png`;
  if (!fs.existsSync(spritePath.slice(1))) {
    console.log('@', spritePath)
    throw new Error(form || name)
  }

  return `${form || name}: require('${spritePath}'),`;
});

const data = `// THIS FILE IS AUTOMATICALLY GENERATED. PLEASE SEE scripts/generateSprites.js
export default {
  ${lines.join('\n  ')}
};`;

fs.writeFileSync('./src/sprites.js', data, 'utf-8');
