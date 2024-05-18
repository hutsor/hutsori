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

export const randInt = (min: number, max: number, prng: () => number) =>
  Math.floor(prng() * (max + 1 - min)) + min;

export function sampleByWeights<T>(
  weights: ArrayLike<[T, number]>,
  prng: () => number,
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
  array: { length: number },
  prng: () => number,
): number => {
  return randInt(0, array.length - 1, prng);
};

export const sample = <T>(array: ArrayLike<T>, prng: () => number): T => {
  return array[randInt(0, array.length - 1, prng)];
};
