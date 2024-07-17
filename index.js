const Express = require('express');
const Cors = require('cors');
const Leet =require('./leetcodeinfo');
const app = Express();

app.use(Cors({
    origin:'*'
}))


app.get('/:id',Leet.info);
  const port=5000;
  const server = app.listen(port);