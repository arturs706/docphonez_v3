module.exports = {
  experimental: {
    urlImports: ['https://unpkg.com', 'https://cdn.skypack.dev', 'https://cdnjs.cloudflare.com', 'https://res.cloudinary.com', 'https://cdn.jsdelivr.net'],
    appDir: true
  },
  reactStrictMode: true,
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['files.stripe.com', 'res.cloudinary.com', 'mdbcdn.b-cdn.net']
  },
};