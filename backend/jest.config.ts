import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';

const moduleNameMapper = pathsToModuleNameMapper({
  '~/*': ['src/*'],
});

const config: JestConfigWithTsJest = {
  displayName: 'backend',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: './tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  setupFiles: ['dotenv/config'],
  testRegex: '.*\\.test\\.ts$',
  modulePaths: ['./'],
  moduleNameMapper: moduleNameMapper,
};

export default config;
