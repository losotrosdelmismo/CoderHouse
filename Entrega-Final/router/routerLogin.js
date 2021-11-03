const bcrypt = require('bcrypt');
const express = require('express');
const multer = require('multer');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');
let persistencia = require('../repository/factory').getPersistencia();
let getPersistencia = new persistencia
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/winston');
const jwt = require('../utils/jwt');


const mailing = require('../utils/mailing')

function getRoot(req, res) {    
}

//----LOGIN--------
function getLogin(req, res) {
  if (req.isAuthenticated()) {    
    var user = req.body;    
    res.render('login-ok', {
      usuario: user.username,
      nombre: user.firstName,      
    });
  }
  else {
    logger.error('user NO logueado');
    res.send("user NO logueado");
  }
}

function postLogin (req, res) {
  var user = req.body.username;
  req.session.username = user;
  req.session.JWT = jwt.generateToken(user);
  req.session.username = user;
  
  res.render('loginOk')
}

function getFaillogin (req, res) {
    logger.error('error en login');
    res.send('login-error');
  }

//----SINGUP---------
function getSignup(req, res) {
    
    res.render('singup');
}


var user;//variable donde guardo al usuario que se registra

async function postSignup (req, res) {

  user = req.body;  
  user.password = await createHash(user.password);
  user.foto =  user.username;
  const quePersistencia = require('../config/config.json').persistencia;
  if(quePersistencia == 'mysql'){
    user.carrito = ' '; 
  }else{
    user.carrito = [];
  }
  
  await getPersistencia.guardar(user, "users");  
  res.redirect('/subir');  
}


function getFailsignup (req, res) {
  logger.error('error en signup');
  res.send('signup-error');
} 


//---OTROS------
function getLogout (req, res) {
  req.logout();
  
  res.render('index')
}

function failRoute(req, res){
  res.status(404).render('routing-error', {});
}

function formulario (req, res) {
   
   res.render('login')
}

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);//mucho muy importante aca hace el hash de encriptacion
} 

// incorporo el router
const router = express.Router();

// configuro multer
let storage = multer.diskStorage({   
    destination: function (req, file, callback) {
        logger.warn();(file);        
        callback(null, 'public/uploads')
    },
    filename: function (req, file, callback) {      
        callback(null, `${file.originalname}`)
    }
});


const upload = multer({ storage: storage });
router.get('/subir', (req, res) => {
    mailing.createMailOptions('nuevo-usuario', user);     
    
    res.render('subir-foto')
});

router.post('/uploadFoto', upload.single('foto'), (req, res, next) => {
    
    const file = req.file
    
    if (!file) {
        const error = new Error('Error subiendo archivo')
        error.httpStatusCode = 400
        return next(error)
    }
    (async () => {
      try{
        console.log(user.username)
         await getPersistencia.actualizar(user.username, file.filename, 'users') 
      }catch(error){
       logger.error("Fallo cargar articulo nuevo en carrito")
      }        
  })();  

    //res.sendFile('index.html', { root: './views' });
    res.render('index')
});


module.exports = {
  formulario,
  getRoot,
  getLogin,
  postLogin,
  getFaillogin,
  getLogout,
  failRoute,
  getSignup,
  postSignup,
  getFailsignup,
  router
}