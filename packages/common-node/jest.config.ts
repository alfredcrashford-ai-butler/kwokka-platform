const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test/test-setup.ts'],
  verbose: true,
  silent: false,
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', 'dist', 'certbot', 'coverage', 'dump'],
  collectCoverage: true,
  // nanoid is a ESM-only package and tests break without the below lines
  transform: { 'node_modules/nanoid/.+\\.(j|t)s?$': 'ts-jest' },
  transformIgnorePatterns: ['node_modules/(?!nanoid/.*)'],
};

export default config;
