import localFont from 'next/font/local'

export const inter = localFont({
    src: [
      {
        path: '../public/assets/fonts/Inter/Inter-Regular.ttf',
        weight: '400',
        style: 'normal',
		variable: "--font-inter",
      },
      {
        path: '../public/assets/fonts/Inter/Inter-Medium.ttf',
        weight: '500',
        style: 'normal',
		variable: "--font-inter",
      },
      {
        path: '../public/assets/fonts/Inter/Inter-SemiBold.ttf',
        weight: '600',
        style: 'normal',
		variable: "--font-inter",
      },
      {
        path: '../public/assets/fonts/Inter/Inter-Bold.ttf',
        weight: '700',
        style: 'normal',
		variable: "--font-inter",
      },
    ],
  })


