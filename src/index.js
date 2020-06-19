const express = require("express")
const app = express()
const morgan = require("morgan")

// Settings
app.set('port', process.env.PORT || 3001)
//Middleware 
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Routes
app.use(require('../routes/index'))


app.listen(app.get('port'), ()=> {
    console.log(`Server funcionando en puerto ${app.get('port')}`)
}) 