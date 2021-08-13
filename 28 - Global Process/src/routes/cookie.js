const express = require('express');
const router = express.Router();
const factory = require("../repository/factory");
const persistenciaTipo = require("../config/config.json").persistencia; 
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser());

router.get('/set', (req, res) => {
    res.cookie('server', 'usuario').send('usuario ingresado')
})