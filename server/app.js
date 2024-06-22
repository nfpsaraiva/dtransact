const express = require('express');
const app = express();
const cors = require('cors')
const port = 3001;
const fs = require('fs');

app.use(cors());
app.use(express.json())

app.get('/ping', (req, res) => {
  res.send("OK");
});

app.get('/contracts/arbiter/:address', (req, res) => {
  let contracts = require('./contracts.json');

  contracts = contracts.filter(c => c.arbiter === req.params.address);

  res.send(contracts);
});

app.get('/contracts/signer/:address', (req, res) => {
  let contracts = require('./contracts.json');

  contracts = contracts.filter(c => c.signer === req.params.address);

  res.send(contracts);
});

app.get('/contracts/beneficiary/:address', (req, res) => {
  let contracts = require('./contracts.json');

  contracts = contracts.filter(c => c.beneficiary === req.params.address);

  res.send(contracts);
});

app.post('/contracts/', (req, res) => {
  const contracts = require('./contracts.json');

  contracts.push(req.body.contract);

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.put('/contracts/approve/:address', (req, res) => {
  let contracts = require('./contracts.json');

  contracts = contracts.map(c => {
    if (c.address === req.params.address) {
      c.status = 'Approved'
    }

    return c;
  });

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.put('/contracts/decline/:address', (req, res) => {
  let contracts = require('./contracts.json');

  contracts = contracts.map(c => {
    if (c.address === req.params.address) {
      c.status = 'Declined'
    }

    return c;
  });

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.delete('/contracts/:address', (req, res) => {
  let contracts = require('./contracts.json');

  contracts = contracts.filter(c => c.address !== req.params.address);

  fs.writeFile('./contracts.json', JSON.stringify(contracts), () => {
    res.send(contracts);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})