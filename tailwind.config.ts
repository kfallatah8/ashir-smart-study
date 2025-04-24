
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#8B5CF6',
					foreground: '#FFFFFF',
					100: '#EBE3FF',
					200: '#D6C7FF',
					300: '#B69EFF',
					400: '#9D7DFF',
					500: '#8B5CF6',
					600: '#7046DC',
					700: '#5731B3',
					800: '#402089',
					900: '#2D1260'
				},
				secondary: {
					DEFAULT: '#7E69AB',
					foreground: '#FFFFFF',
					100: '#E8E3F3',
					200: '#D1C7E7',
					300: '#B9ACDB',
					400: '#9C8BC4',
					500: '#7E69AB',
					600: '#655391',
					700: '#4D3E77',
					800: '#36295D',
					900: '#1F1444'
				},
				accent: {
					DEFAULT: '#0EA5E9',
					foreground: '#FFFFFF',
					100: '#E0F7FF',
					200: '#B8EAFF',
					300: '#83D9FF',
					400: '#4CCAFF',
					500: '#0EA5E9',
					600: '#0086CB',
					700: '#006AA1',
					800: '#004D77',
					900: '#00324E'
				},
				highlight: {
					DEFAULT: '#F97316',
					foreground: '#FFFFFF',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: '#F1F0FB',
					foreground: '#6B7280'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				dark: '#1A1F2C'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
