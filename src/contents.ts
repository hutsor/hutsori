export function createHelloWorld() {
  return Object.assign(document.createElement('h1'), { innerHTML: `Hello, World!` });
}
