export const encodeHexLE = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex = `${bytes[i].toString(16).padStart(2, "0")}${hex}`;
  }
  return hex;
};

export const decodeHexLE = (text: string) => {
  const bytes = new Uint8Array(Math.ceil(text.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    const r = bytes.length - i - 1;
    const hex = text.substring(i * 2, (i + 1) * 2);
    if (hex.length !== 2) throw new Error("Malformed Hex");
    const byte = parseInt(hex, 16);
    if (isNaN(byte)) throw new Error("Malformed Hex");
    bytes[r] = parseInt(hex, 16);
  }
  return bytes.buffer;
};

export function generateSeed() {
  const seed = new Uint32Array(4);
  crypto.getRandomValues(seed);
  return encodeHexLE(seed.buffer);
}

export function xoshiro128ss(seed: string) {
  const buffer = decodeHexLE(seed);
  if (buffer.byteLength !== 16) throw new Error("Malformed seed");
  const state = new Uint32Array(buffer);
  return () => {
    const t = state[1] << 9;
    let r = state[1] * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    state[2] ^= state[0];
    state[3] ^= state[1];
    state[1] ^= state[2];
    state[0] ^= state[3];
    state[2] ^= t;
    state[3] = (state[3] << 11) | (state[3] >>> 21);
    return (r >>> 0) / 4294967296;
  };
}

export const randInt = (prng: () => number, min: number, max: number) =>
  Math.floor(prng() * (max + 1 - min)) + min;

export function sampleByWeights<T>(
  prng: () => number,
  weights: ArrayLike<[T, number]>,
) {
  const accws: number[] = [];
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    const r = weights[i][1];
    accws.push((accws.at(-1) ?? 0) + r);
    sum += r;
  }
  const v = prng() * sum;
  for (let i = 0; i < weights.length; i++) {
    if (v < accws[i]) return weights[i][0];
  }
  return weights[0]?.[0];
}

export const sampleIndex = (
  prng: () => number,
  array: { length: number },
): number => {
  return randInt(prng, 0, array.length - 1);
};

export const sample = <T>(prng: () => number, array: ArrayLike<T>): T => {
  return array[randInt(prng, 0, array.length - 1)];
};

// Standard Normal variate using Box-Muller transform.
export function randNorm(prng: () => number, mean = 0, stdev = 1) {
  const u = 1 - prng(); // Converting [0,1) to (0,1]
  const v = prng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}
