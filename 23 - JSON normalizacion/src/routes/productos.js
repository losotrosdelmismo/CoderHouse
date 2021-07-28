const express = require('express');
const router = express.Router();
const controller = require('../api/productos');


router.get('/productos', async (req, res) => {
    try {
        let result = await controller.findAll();
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.get('/productos/:id', async (req, res) => {
    try {
        let result = await controller.findById(req.params.id);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//asi tira un error raro 
router.get('/productos/vista', async (req, res) => {
    let num = req.query.num || 10;
    if(num < 1){
        res.send("no hay productos!!")
    }
    let obj = [];
    
    for (let i = 0; i < num; i++) {
         obj.push( {titulo: faker.commerce.product(), 
            precio: faker.commerce.price(), 
            imagen: faker.commerce.product()
        })
    }   
    
    res.json({obj})
    
});


router.post('/productos', async (req, res) => {
    try {
        let result = await controller.create({title: "prueba"});
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.put('/productos/:id', async (req, res) => {
    try {
        let result = await controller.update(req.params.id, { $set: {actualizado: new Date()}});
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

router.delete('/productos/:id', async (req, res) => {
    try {
        let result = await controller.delete(req.params.id);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

module.exports = router;