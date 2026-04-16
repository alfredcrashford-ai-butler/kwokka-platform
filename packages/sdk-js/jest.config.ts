const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  silent: false,
  testPathIgnorePatterns: ['/node_modules/', 'dist', 'coverage'],
  collectCoverage: true,
};

export default config;
