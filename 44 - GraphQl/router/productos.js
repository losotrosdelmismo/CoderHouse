const express = require('express');
const router = express.Router();
const mongo = require('../api/mongoCrud');
let mongoCrud = new mongo;

var data = []; //array donde paso los datos

router.get('/productos', async (req, res) => {
    try {        
        let result = await mongoCrud.leer(data, "productos")
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/productos/:id', async (req, res) => {
    try {        
        let result = await mongoCrud.leer(data, "productos", req.params.id)
        res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.post('/productos', async (req, res) => {
    try {        
        let result = await mongoCrud.guardar({title: "prueba"}, "productos")
        return res.json({Agregado: "Articulo agregado desde metodo post", result: result});
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/productos/:id', async (req, res) => {
    try {            
            let result = await mongoCrud.actualizar(req.params.id,  new Date().toLocaleString(), "productos");
            return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.delete('/productos/:id', async (req, res) => {
    try {        
        let result = await mongoCrud.borrar(req.params.id, "productos");
        return res.json(result);
        
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});



module.exports = router;