import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

/**
 * Flat ESLint config
 * Type-aware linting enabled via parserOptions.project so we catch TS issues early.
 */
export default tseslint.config([
    globalIgnores(['dist', 'node_modules', 'build', '.turbo', '.next', '.cache']),
    {
        files: ['**/*.{ts,tsx}'],
        ignores: [
            'node_modules',
            'dist',
            'src/components/**',
            'src/context/**',
            'src/hooks/**',
            'src/pages/**',
            'src/layouts/**',
        ],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.app.json', './tsconfig.node.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]);
