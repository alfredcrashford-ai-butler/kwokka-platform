const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  silent: false,
  testPathIgnorePatterns: ['/node_modules/', 'dist', 'coverage'],
  collectCoverage: true,
  // nanoid is a ESM-only package and tests break without the below lines
  transform: { 'node_modules/nanoid/.+\\.(j|t)s?$': 'ts-jest' },
  transformIgnorePatterns: ['node_modules/(?!nanoid/.*)'],
};

export default config;
