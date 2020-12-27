/* eslint-disable no-console */
const { server } = require('./app');
const ngrok = require('ngrok')
const port = 8080;

server.listen(port, () => {
console.log(`Listening at http://localhost:${port}`);
});
