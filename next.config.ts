module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/site',
        permanent: true, 
      },
    ];
  },
};
