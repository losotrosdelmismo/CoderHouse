const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const logger = require('winston');
const server = require('../server');
const http = require('http').Server(server.app);
const io = require('socket.io')(http);


var usuarios = [];

async function cargaDatos(){
    try{       
        usuarios = await mongoCrud.leer(usuarios, "users"); //pasamos un string para que cargue la base de datos que corresponde 
        
    }
    catch(error){
        logger.error(error);
    }
}
cargaDatos()


let globalId = 0;

passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {
        let usuario = usuarios.find(u => u.username === username);

        if (!usuario) {
            logger.error('usuario no encontrado con el nombre:', username);
            return done(null, false, logger.error('mensaje', 'usuario no encontrado'));
        } else {
            if (!isValidPassword(usuario, password)) {
                logger.error('contraseña invalida');
                return done(null, false, logger.error('mensaje', 'contraseña invalida'));
            } else {               
               io.on('connect', socket => {                           
                    socket.emit('usuario', usuario);                   
                    socket.emit('productos', productos);
                    socket.emit('mensajes', chat);    
                })                
                return done(null, usuario);
            }
        }
    })
);

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, function (req, username, password, done) {
    let usuario = usuarios.find(u => u.username === username);

    if (usuario) {
        logger.error('usuario ya existe');
        return done(null, false, logger.error('mensaje', 'usuario ya existe'));
    } else {        

         newUser = {
            id: ++globalId,
            username: username,
            password: createHash(password),
            rol: req.body.rol
        };
        
        usuarios.push(newUser);
        return done(null, newUser);
    }
})
);

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);//mucho muy importante aca hace el hash de encriptacion
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    let user = usuarios.find(u => u.id == id);
    return done(null, user);
});

module.exports = passport;