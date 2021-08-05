// inicializamos la conexion
const socket = io.connect();

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








