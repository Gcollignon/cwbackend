const express = require('express');
const mongoose = require('mongoose');
const coleweight_router = require('./routes/coleweight');
const dev_router = require('./routes/dev')
const malicious_router = require('./routes/malicious')
const wr_router = require('./routes/wr');
const config = require('../config.json')

const app = express();
app.use('/api/coleweight/', coleweight_router)
app.use('/dev/', dev_router);
app.use('/api/malicious/', malicious_router);
app.use('/api/wr/', wr_router);
app.listen(3000, async () => {
  console.log('Server is running.')
  await mongoose.connect(config.mongodb);

})

