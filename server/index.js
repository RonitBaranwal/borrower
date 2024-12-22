// console.log("Hello World");

const express = require('express')
const app = express()
const port = 5000


//DB connect
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/DB_NAME')
 
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/signup',(req,res)=>{
   const username = req.body.username;
   const password = req.body.password;

})
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})