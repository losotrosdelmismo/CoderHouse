const bcrypt = require('bcrypt');
const express = require('express');
const multer = require('multer');
const { connectableObservableDescriptor } = require('rxjs/internal/observable/ConnectableObservable');
const mongo = require('../api/mongoCrud');
let mongoCrud = new mongo;
const dotenv = require('dotenv');
dotenv.config();
const logger = require('../utils/winston');

const mailServidor = 'losotrosdelmismo@gmail.com'//mail del servidor

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
    res.send("TODO MAL!!!!!!");
  }
}

function postLogin (req, res) {  
  res.sendFile('loginOk.html', { root: './views' });
}

function getFaillogin (req, res) {
    logger.error('error en login');
    res.send('login-error');
  }

//----SINGUP---------
function getSignup(req, res) {
    res.sendFile('singup.html', { root: './views' }) 
}


var user;//variable donde guardo al usuario que se registra

async function postSignup (req, res) {

  user = req.body;  
  user.password = await createHash(user.password);
  user.foto =  user.username; 
  await mongoCrud.guardar(user, "users");  
  res.redirect('/subir'); 
}


function getFailsignup (req, res) {
  logger.error('error en signup');
  res.send('signup-error');
} 


//---OTROS------
function getLogout (req, res) {
  req.logout();
  res.sendFile('index.html', { root: './views' });;
}

function failRoute(req, res){
  res.status(404).render('routing-error', {});
}

function formulario (req, res) {
   res.sendFile('login.html', { root: './views' })
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
    createMailOptions('nuevo-usuario', user);     
    res.sendFile('subir-foto.html', { root: './views' });
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
         await mongoCrud.actualizar(user.username, file.filename, 'users') 
      }catch(error){
       logger.error("Fallo cargar articulo nuevo en carrito")
      }        
  })();  

    res.sendFile('index.html', { root: './views' });
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