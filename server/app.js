const express = require('express');
const app = express();
const cors = require('cors')
const port = 3001;
const fs = require('fs');

app.use(cors());
app.use(express.json())


app.get('/contracts/', (req, res) => {
  const contracts = require('./contracts.json');

  res.send(contracts);
});

app.post('/contracts/', (req, res) => {
  const contract = req.body.contract;

  const contracts = require('./contracts.json');

  contracts.push(contract);

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.put('/contracts/approve/:address', (req, res) => {
  const contracts = require('./contracts.json');

  contracts = contracts.map(c => {
    if (c.address === req.param.address) {
      c.status = 'Approved'
    }
  });

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.put('/contracts/decline/:address', (req, res) => {
  const contracts = require('./contracts.json');

  contracts = contracts.map(c => {
    if (c.address === req.param.address) {
      c.status = 'Declined'
    }
  });

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})