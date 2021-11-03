Bazar e-commerce con un poco de todo.
el sistema permite registrarse, subir una foto perfil (el nombre no tiene que tener espacios para que lo lea), el server manda un mail al administrador
cada vez que se registra alguien nuevo.
una vez registrado entramos al sitio de compras. La vista arma el carrito de compra y envia un mail a la cuenta registrada una vez finalizado.
Tambien esta configurado para mandar SMS y whatsapp esta disponible si se ingresan los datos y telefono valido para hacer la prueba

Aspectos a configurar: 

DEJO UN TXT CON LAS VARIABLES PARA ARMAR EL .env 
se puede correr con npm run dev o prod para arrancar los distintos modos. (en este caso esta solo de ejemplo ya que lo unico que hace es 
modificar el puerto de conexion)
En la carpeta config tenemos el config json ahi se puede configurar la base de datos (mongo o mysql) y el tiempo de duracion de la secion
con jason web token.

rutas:

a todas las rutas para usar el crud se accede con api/...

LAS RUTAS DE PRODUCTOS ESTAN PROTEGIDAS POR JASON WEB TOKEN

GET /productos: lista los productos
GET /productos/:id : busca un producto por ID
POST /productos: crea un articulo de prueba y lo inserta en la base de datos
PUT /productos/:id : busca un producto por ID y le actualiza la fecha de ingreso
GET /ingresarProducto: formulario para ingresar producto
DELETE /productos/:id : borrar articulo por ID

mensajes:
GET /messages: lista los mensajes
GET /messages/:id : busca un mensaje por ID
POST /messages: crea un mensaje de prueba y lo inserta en la base de datos
PUT /messages/:id : busca un mensaje por ID y le actualiza la fecha de ingreso
DELETE /messages/:id : borrar articulo por ID

estrucctura de catpetas:

api: lugar donde ubico el CRUD, el crud funciona pasando un array y un string que indica que tipo de modelo refiere. Como 
opcional, se le puede pasar un numero para busca el id o username segun el tipo de modelo.

database: archivo para configurar la base de datos

log-winston: donde alojamos todos los logs del sistema

models: lugar donde alojamos los diferentes tipos de modelos para mongoose y knex

persistencia: donde guardamos todas las persistencias originales. Si no existe en mongo el sistema busca la persistencia y crea la base de datos

public: archivos estaticos, imagenes y Js del cliente

router: donde alojamos todos los routers

utils: alojamos todos los componentes complementarios, mail, SMS y logger

views: vistas en HTML



