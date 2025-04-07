const express = require("express");
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3000
const mainRouter = require('./routes/index')
app.use('/api/v1',mainRouter)

app.listen(PORT,()=>{
    console.log('listening at http://localhost:'+PORT);
    
})