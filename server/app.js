const express = require('express');
const app = express();
const cors = require('cors')
const port = 3001;

let contracts = [];

app.use(cors());
app.use(express.json())


app.get('/contracts/', (req, res) => {
    res.send(contracts);
});

app.post('/contracts/', (req, res) => {
  const contract = req.body.contract;

  contracts.push(contract);

  res.send(contracts);
});

app.put('/contracts/approve/:address', (req, res) => {
  contracts = contracts.map(c => {
    if (c.address === req.param.address) {
      c.status = 'Approved'
    }
  });

  return res.send(contracts);
});

app.put('/contracts/decline/:address', (req, res) => {
  contracts = contracts.map(c => {
    if (c.address === req.param.address) {
      c.status = 'Declined'
    }
  });

  return res.send(contracts);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})