module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 7545,            // Standard Ethereum port untuk Ganache
      network_id: "*",       // Any network ID
    }
  },
  compilers: {
    solc: {
      version: "0.8.21",    // Versi solc yang digunakan
    }
  }
};
