const request = require('supertest')('http://localhost:8080');
const expect = require('chai').expect;


describe('test api rest full', () => {
    describe('GET', () => {
        it('debería retornar los productos en el body', async () => {
            let response = await request.get('/api/productos');
                    
            expect(response.body).to.have.lengthOf(21);
            
        })
    })
    describe('POST', () => {
        it('debería incorporar un usuario', async () => {
             let producto = {
                title: 'producto-insertadoXtest',
                price: 100
            } 
            

            let response = await request.post('/api/productos').send(producto);
            //console.log(response.status)
            //console.log(response.body)
            
            const user = response.body;
            expect(user).to.include.keys('Agregado', "result");          
            
        })
    })
})
