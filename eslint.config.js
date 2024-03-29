import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
} from '@antfu/eslint-config'

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript({
    overrides: {
      'node/prefer-global/process': 'off',
    },
  }),
  stylistic(),
  vue(),
  jsonc(),
  toml(),
  markdown(),
)
