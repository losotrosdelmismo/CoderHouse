// inicializamos la conexion
const socket = io.connect();

// recibo desde el servidor un mensaje
socket.on('productos', data => {
    console.log(data.price)
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
           
                    <tr><td>${e.title}</td> <td>${e.price}</td> <td><img width="50" src=${e.thumbnail} alt="not found"></td><td>${e.actualizado}</td></tr>
           
    `
});
        
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