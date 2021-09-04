// inicializamos la conexion
const socket = io.connect();
//-----CHAT----------
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
    console.log(document.querySelector('#texto').value)
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


//---------------Producto-------------------------
socket.on('productos', data => {
    console.log(data)    
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
    
    let picture = JSON.stringify(usuario.photos[0].value)
    
    if(usuario != null){
        document.querySelector(".bienvenida").innerHTML = `<div> <img src=${picture} alt="">
        <h1 class="usuario">HOLA ${usuario.displayName} BIENVENIDO A NUESTRA GRAN WEB</h1></div><form action="/logout" method="get">
        <h1>Tu mail es: ${usuario.emails[0].value} que tengas un lindo dia</h1></div>
                
    <button class="btn btn-danger">salir</button>
    `
    }
    const mailOptions = {
        from: 'losotrosdelmismo@gmail.com',
        to: usuario.emails[0].value,
        subject: 'usuario logueado',
        html: `<h1 style="color: green;">El usuario ${usuario.displayName} fue logueado exitosamente</h1><h2>fecha de ingreso: ${new Date().toLocaleString()}</h2> 
        <div> <img src=${picture} alt="">`
    }
    socket.emit('envio-mail', mailOptions);
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
    console.log("anda")
    let p = {
        title: document.querySelector('#title').value,
        price: document.querySelector('#price').value,
        thumbnail: document.querySelector('#thumbnail').value
    }
    console.log(p)
    socket.emit('producto-nuevo', p);
}








