/* eslint-disable no-console */
const { server } = require('./app');

const port = 8080;

server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
