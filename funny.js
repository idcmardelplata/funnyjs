function toArray(args) {
  return [].slice.call(args);
}

//curry::(x, y ,n...) -> (x) -> (y) -> (n..)
function curry(fn) {
  var len = fn.length;
  var args = [];
  return function next() {
    args = args.concat(toArray(arguments));
    return (args.length >= len) ? 
      fn.apply(this, args.splice(0)) : 
      next;
  }
}

//id::x -> x
const id = x => x

//compose::(f,g) -> ()
const compose = curry((f,g) => x => f(f(x)))

//map::f -> F -> F
const map = curry((f,F) => F.map(f))

//chain::(f, M) -> M
const chain = curry((f, m) => m.chain(f))

const Right = x => ({
  x,
  map: f => Right(f(x)),
  chain: f => f(x),
  fold: (_,r) => r(x),
  inspect: () => `Right(${x})`
})

const Left = x => ({
  x,
  map: f => Left(x),
  chain: f => f(x),
  fold: (l,_) => l(x),
  inspect: () => `Left(${x})`
})

const Either = {}
//Either.of:: x ~> Either x
Either.of = x => x == null ? Left(null) : Right(x)

//fromNullable:: x ~> Either x
const fromNullable = Either.of

const Just = x => ({
  x,
  map: f => Just(f(x)),
  chain: f => f(x),
  inspect: () => `Just(${x})`
})

const Nothing = x => ({
  x,
  map: f => Nothing(x),
  chain: f => f(x),
  inspect: () => `Nothing(${x})`
})
const Maybe = {}
//Maybe.of:: x ~> Maybe x
Maybe.of = x => x != null ? Just(x) : Nothing(null)

const IO = f => ({
  runIO: f,
  map: fn => map(fn, runIO),
  inspect: () => `IO(${runIO})`
})
//IO.of:: fn -> IO fn
IO.of = fn => IO(fn)

module.exports = {
  curry,
  chain,
  id,
  compose,
  map,
  Either,
  Right,
  Left,
  Maybe,
  Just,
  Nothing,
  IO
}
