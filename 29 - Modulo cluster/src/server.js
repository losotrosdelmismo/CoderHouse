const express = require('express');
const exphbs = require('express-handlebars');
//---CLUSTER-------------
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// ------------------------------------------------------------------------------
//  PASSPORT
// ------------------------------------------------------------------------------
const passport = require('passport');
const routes = require('./routes');
const config = require('./config/config.json');
const controllersdb = require('./config/controllersdb');
const User = require('./models/usuarios');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');

dotenv.config();

// completar con sus credenciales
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || config.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_ID_SECRET || config.FACEBOOK_CLIENT_ID_SECRET;

// creamos la aplicacion
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

var usuario; //variable para pasar profile de facebook

// configuramos passport para usar facebook
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,//FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,//FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
}, function (accessToken, refreshToken, profile, done) {
    
    usuario = profile;
    return done(null, usuario);
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// inicializamos passport
app.use(passport.initialize());
app.use(passport.session());

// ------------------------------------------------------------------------------
//  EXPRESS
// ------------------------------------------------------------------------------

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

//Iniciamos Web Socket
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/public'));



app.use(express.static(__dirname + '/views'));
//app.use(require('cookie-parser')());
//app.use(bodyParser.urlencoded({ extended: true }));

// app.use(require('express-session')({
//   secret: 'keyboard cat',
//   cookie: {
//     httpOnly: false,
//     secure: false,
//     maxAge: config.TIEMPO_EXPIRACION
//   },
//   rolling: true,
//   resave: true,
//   saveUninitialized: false
// }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  /*
  console.log('-- session --');
  console.log(req.session);
  console.log('-- headers --');
  console.log(req.headers.cookie);
  console.log('-------------');
  console.log('-- cookies --');
  console.log(req.cookies);
  console.log('-------------');
  console.log('-- signed cookies --');
  console.log(req.signedCookies);
  console.log('-------------');
  */
  next()
});

//-------------------Productos-------------------
const factory = require("./repository/factory");
const persistenciaTipo = require("./config/config.json").persistencia; 
const router = require('./routes/productos');

var data = [];//variable donde guardo los productos
var admin = true;//bool para saber si estas logueado 

//variable para cargar las base de datos
// ( async () => {   
    
//   let Persistencia = factory.getPersistencia(persistenciaTipo);
//   let instancia = new Persistencia();
//   data = await instancia.leer(data, "productos"); //pasamos un string para que cargue o mensajes o productos  
 
// })()

app.get('/', async (req, res) => {  
  try{
     await loadData();//cargamos la base de datos    
     
     res.render('main', { logeado: admin, nombre: usuario, productos: data , hayProductos: true });
     
  }catch{
    res.render('main', {  logueado: false, productos: data , hayProductos: true });
     
  } 
 })

 io.on('connect', socket => {
  console.log('usuario conectado');
  socket.emit('productos', data); 
  socket.emit('usuario', usuario); 
  console.log(usuario)
  // recibo un evento del cliente, con su correspondiente dato
  socket.on('producto-nuevo', productoNuevo => {        
      productoNuevo.id = data.length + 1;
      data.push(productoNuevo);   
      (async () => {
          try{
              let Persistencia = factory.getPersistencia(persistenciaTipo);
              let instancia = new Persistencia();
              await instancia.guardar(data, "productos");
          }catch(error){
           console.log("Fallo cargar nuevo producto")
          }        
      })();                
      io.sockets.emit('productos', data);
  });
})

//Ponemos a escuchar el server con cluster
// crear los workers
if (cluster.isMaster) {
    console.log('num CPUs', numCPUs)
    console.log(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); // creamos un worker para cada cpu
    }

    // controlamos la salida de los workers
    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died');
        cluster.fork()
    });

} else {
    const PORT = process.env.PORT || config.PORT;
    http.listen(PORT, () => {
        console.log(`servidor escuchando en http://localhost:${PORT} pid: ${process.pid}`);
    });
}


//-----RUTAS FACEBOOK---------
app.get('/auth/facebook', passport.authenticate('facebook'))

app.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect: '/',
        failureRedirect: '/faillogin'
    } 
));

app.get('/faillogin', (req, res) => {
    res.status(401).send({ error: 'no se pudo autenticar con facebook' })
}); 

app.get('/datos', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('<h1>datos protegidos</h1>');
    } else {
        res.status(401).send('debe autenticarse primero');
    }
});

app.get('/logout', (req, res) => {
    usuario = null;
    req.logout();
    res.redirect('/')
});

app.get('/info', (req, res) => {
    res.json({
        argumentos_de_entrada: process.argv,
        plataforma: process.platform,
        version_de_node: process.version,
        uso_de_memoria: process.memoryUsage(),
        path_de_ejecucion: process.execPath,
        process_ID: process.pid,
        carpeta_corriente: process.cwd(),
        Numero_de_procesadores: numCPUs
    })
})

//usamos el child process fork 
const { fork } = require('child_process');

app.get('/randoms', (req, res) => {
        let cant = req.query;               
        const calculo = fork('./fork.js');        
        calculo.send(cant);
        calculo.on('message', obj => {
                        
            res.json({obj: obj}) 
        })    
  
})



