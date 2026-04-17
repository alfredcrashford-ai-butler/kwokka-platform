const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  silent: false,
  clearMocks: true,
  testPathIgnorePatterns: [
    "/node_modules/",
    "dist",
    "certbot",
    "coverage",
    "dump"
  ],
  collectCoverage: true,
};

export default config;
