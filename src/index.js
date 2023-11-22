const express = require('express');
const mongoose = require('mongoose');
const coleweight_router = require('./routes/coleweight');
const dev_router = require('./routes/dev')
const malicious_router = require('./routes/malicious')
const app = express();
app.use('/api/', coleweight_router)
app.use('/dev/', dev_router);
app.use('/malicious/', malicious_router);
app.listen(3000, async () => {
  console.log('Server is running.')
  await mongoose.connect('mongodb://127.0.0.1:27017/cw1');

})

