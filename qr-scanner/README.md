# QR Code Scanner

A simple web application built with Next.js for scanning and processing QR codes. The application is ready for deployment on Vercel.

## Features

- Upload QR code images for scanning
- Use device camera to scan QR codes in real-time
- "I'm Feeling Lucky" button to directly open the first URL detected
- Copy decoded QR code content with a single click
- Open detected URLs directly in a new tab

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- html5-qrcode library for QR code scanning

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy this application is to use the [Vercel Platform](https://vercel.com/new).

1. Push this project to a GitHub, GitLab, or Bitbucket repository.
2. Import the project to Vercel.
3. Vercel will detect that you're using Next.js and set up the build configuration for you.

## Browser Compatibility

The QR code scanning functionality works best in modern browsers that support the WebRTC API for camera access. For the best experience, use Chrome, Firefox, or Edge.

## License

This project is MIT licensed.
