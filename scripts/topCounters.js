const fs = require('fs')

const defenderProfile = require('pokemagic/defenderProfile')
const findPokemon = require('pokemagic/lib/findPokemon')
const topPokemon = require('pokemagic/lib/topPokemon')

const map = {}

topPokemon.forEach(poke => {
  const res = defenderProfile(poke.name, null, null, {
    legacy: false,
    numPokemon: 4,
    tm: false,
  })

  map[poke.id] = res.counters.map((counter) => {
    return {
      m1: counter.quick,
      m2: counter.charge,
      p: counter.results.map(x => {
        const pokemon = findPokemon(x.name)
        const [quick, charge] = x.stats[0].moves

        return [
          pokemon.id,
          pokemon.moves.quick.indexOf(quick),
          pokemon.moves.charge.indexOf(charge),
        ]
      }),
    }
  })
})

fs.writeFileSync('./src/data/topCounters.json', JSON.stringify(map))
