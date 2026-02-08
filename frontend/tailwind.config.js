/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#06439F',
          accent: '#FFD600',
        },
        surface: {
          '0': '#FFFFFF',
          '1': '#FAFAFA',
          '2': '#F5F6F8',
        },
        text: {
          strong: '#111827',
          default: '#374151',
          muted: '#6B7280',
        },
        border: {
          default: '#E5E7EB',
        },
        category: {
          show: '#E34646',
          exhibition: '#4A6BAB',
          festival: '#88D64C',
          education: '#70D4A4',
          etc: '#AE5D97',
        },
      },
      borderRadius: {
        card: '1rem', // 카드: rounded-2xl(1rem)
        control: '0.75rem', // 버튼/입력: rounded-xl(0.75rem)
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,24,40,0.06)',
        lift: '0 10px 15px -3px rgba(16,24,40,0.10), 0 4px 6px -4px rgba(16,24,40,0.10)',
      },
    },
    fontFamily: {
      LexendDeca: ['Lexend Deca'],
      Pretendard: ['Pretendard'],
    },
  },
  plugins: [],
};
