// inicializamos la conexion
const socket = io.connect();

//---------------Producto-------------------------
socket.on('productos', data => {
    console.log("productos recibido")    
    let tabla = document.querySelector('.tabla')
    tabla.innerHTML = `<h1>Vista de Productos</h1>
    <br>
    <table class="table table-dark">
                <tr><th>Nombre</th><th>Precio</th><th>Foto</th><th>Actualizado</th></tr>
                <tbody class="tablaDATA"></tbody>
                </table>
        `
    let tablaDATA = document.querySelector('.tablaDATA')
    data.forEach(e => {      
     
     tablaDATA.innerHTML += ` 
           
     <tr><td>${e.title}</td> <td>${e.price}</td> <td><img width="50" src=${e.thumbnail} alt="not found"></td><td>${e.timeStamp}</td><td>${e.id}</td><td><button class="comprar">COMPRAR</button></td></tr>
           
    `
});

socket.on('usuario', usuario => {
    document.querySelector(".bienvenida").innerHTML = `<h1 class="usuario">HOLA ${usuario} BIENVENIDO A NUESTRA GRAN WEB</h1></div><form action="/logout" method="get">
           
    <button class="btn btn-danger">salir</button>
</form>  `
})

tablaDATA.addEventListener('click', event => {
    if(event.target.classList.contains('comprar')){
        let id = event.target.parentElement.previousElementSibling.textContent;
        let producto;
        
        for(let e of data){
            if(e.id == id){
                producto = e;
            }
        }
        
        console.log(producto) 
        socket.emit('articuloCarrito', producto);
        alert("Felicitaciones compraste "+ producto.title)
    }
        
    })
        
});

function addProducto(){
    let p = {
        title: document.querySelector('#title').value,
        price: document.querySelector('#price').value,
        thumbnail: document.querySelector('#thumbnail').value
    }
    console.log(p)
    socket.emit('producto-nuevo', p);
}

//----------CHAT--------------
function render(data){
    console.log(data)

    var html = data.map(elem => {
        return (`<div class="col row">
                    <p><strong>${elem.autor}</strong>
                    
                    </p><p class="brown">${elem.date}</p><p class="green">${elem.texto}</p>                    
                    </div>
        `)
    }).join('');

    document.querySelector('#mensajes').innerHTML = html;
}

socket.on('mensajes', chat => {
    console.log("mensajes recibido")
    render(chat);    
})

function addMensajes(event){
 mail = document.querySelector('#userName');
    if(mail.value.includes('@')){
        let mensaje = {
            autor: mail.value,
            date: new Date().toLocaleString(),                        
            texto: document.querySelector('#texto').value
        }    
        socket.emit('nuevo-mensaje', mensaje);
        return false;
    }else{
        alert('Ingrese un mail valido')
    }    
}

//-----AGREGAR USUARIO------

function addUsuario(){
    let usuario = document.querySelector(".cargarUsuario").textContent;

    socket.emit('usuario-nuevo', usuario);
}


