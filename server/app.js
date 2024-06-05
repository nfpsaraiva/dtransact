const express = require('express');
const app = express();
const cors = require('cors')
const port = 3001;

const contracts = [];

app.use(cors());
app.use(express.json())


app.get('/contracts/', (req, res) => {
    res.send(contracts);
});

app.post('/contracts/', (req, res) => {
  const contract = req.body.contract;

  contracts.push(contract);

  res.send(contracts);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})