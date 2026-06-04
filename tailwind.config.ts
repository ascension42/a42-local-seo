import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green:           '#5cbe83',
        'green-dark':    '#2e5537',
        'green-deep':    '#284a30',
        'green-light':   '#80d3a2',
        'green-mid':     '#467954',
        surface:         '#eaf7ef',
        bg:              '#fbfaf8',
        'bg-alt':        '#f5f4f0',
        ink:             '#1a1a1a',
        muted:           '#7a7a7a',
        border:          '#e8e6e1',
      },
      fontFamily: {
        sans:   ['var(--font-jakarta)', 'sans-serif'],
        accent: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
