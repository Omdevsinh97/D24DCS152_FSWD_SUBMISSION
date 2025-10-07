const express = require('express');
const setRoutes = require('./routes/index');

const app = express();
const port = 3000;

setRoutes(app);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
