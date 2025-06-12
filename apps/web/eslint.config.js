import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          filter: '_',
          selector: 'variableLike',
          leadingUnderscore: 'allow',
          format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
        },
      ],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'block' },
        { blankLine: 'always', prev: 'block', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@clerk/clerk-react',
              importNames: ['Protect'],
              message:
                'Please use the local Protect component from @/utils/protect instead of importing directly from @clerk/clerk-react',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "VariableDeclarator[id.type='ObjectPattern'] > ObjectPattern > Property[key.name='has']",
          message:
            "Do not destructure 'has' from useAuth(). Please use the useHasPermission hook from @/hooks/use-has-permission instead.",
        },
      ],
    },
  }
);
