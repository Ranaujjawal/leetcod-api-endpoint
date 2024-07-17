const Express = require('express');
const Cors = require('cors');
const Leet =require('./leetcodeinfo');
const app = Express();

app.use(Cors({
    origin:'*'
}))

app.get('/',(req,res)=>{
  res.send('<br>write leet for leetcode at the end of url and then user-name or chef for code chef and then user-name </br>')
})
app.get('/leet/:id',Leet.info);
app.get('/chef/:id',Leet.chefinfo);
  const port=5000;
  const server = app.listen(port);
