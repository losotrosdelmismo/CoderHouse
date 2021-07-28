// inicializamos la conexion
const socket = io.connect();
// const express = require('express');
//const { denormalize, schema } = require('normalizr');
//const prod = require('..api/productos')

//---------------Producto-------------------------
socket.on('productos', data => {    
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

//----------CHAT--------------
function render(data){
    console.log(data)
    
    // const mensaje = new normalizr.schema.Entity('chat');

    // const mensajito = new normalizr.schema.Entity('chateando', {
    //     autor: mensaje,        
               
    // });  
    const user = new normalizr.schema.Entity('autor');
    const comment = new normalizr.schema.Entity('mesaje', {
        autor: user
    });
    
    // defino el esquema de los articulos, que tienen un autor y una cantidad de comentarios
    const article = new normalizr.schema.Entity('articles', {
        author: user,
        comentario: [comment]
    });  
    const desnormalizado = normalizr.denormalize(data, article, article.entities)   
    console.log(desnormalizado)
  
    var html = Object.values(desnormalizado).map( elem =>{
        return (`<div class="col row">
        <p><strong>${elem.alias}</strong>
        
        </p><img width="60" src="${elem.avatar}" alt=""><p class="green">${elem.texto}</p>                    
        </div>
`)
}).join('');
        
    

    document.querySelector('#mensajes').innerHTML = html;
}

socket.on('mensajes', data => {
   
    
    {render(data)};    
})

function addMensajes(event){
 mail = document.querySelector('#mail');
    if(mail.value.includes('@')){
        let mensaje = {
            autor: mail.value,
            nombre: document.querySelector('#nombre').value,
            apellido: document.querySelector('#apellido').value,
            edad: document.querySelector('#edad').value,
            avatar: document.querySelector('#avatar').value,
            alias: document.querySelector('#alias').value,
            texto: document.querySelector('#mensaje').value
        }    
        socket.emit('nuevo-mensaje', mensaje);
        return false;
    }else{
        alert('Ingrese un mail valido')
    }    
}