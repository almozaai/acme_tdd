/*
  *** test-drevin development ***
  testing for Sequelize Models and Express Routs
  just to explain the importance of of dooing testing that to allow us to be able to write some code rapidly in sense that we're not gonna have to open up browser
  we be able to the document how the think our system is going to behave
  and move retively quickly the test
  no only help us get up code written but it's gonna help us mentain our code as we end up writing more code if we know have a problem 

  npm init -y
  to model needing to do the testing 
  npm i mocha chai --save-dev
  mocha testing framework 
  chai assertions library

  --save-dev
  it will indicate that when I end up going to deploy my application these are not libraries that I need 
  these are libraries that I'm going to use for the development part of my application not for production

  go to the package.json and change test to "test:dev": "mocha spec.js --watch"
  by --watch will mak the test rerunning every time file change
  write the code 'npm run test:dev'
*/
const { expect } = require('chai'); //testing done with assertions (chai)  
const db = require('./db');
const { Product, Category } = db.models; 
const app = require('supertest')(require('./app'));
describe('Acme TDD', () => { //descripe is the language of mocha and it is where testing are.
    let seed;
    //beforeEach is pretty common with testing that says hey look what I want to is I want to get my system set up I want control my system I'm gonna seed some data and after that I'll make this asynchronous 
    beforeEach(async()=> seed = await db.syncAndSeed());
    describe('Data Layer', () => {
        it('Foo Bar and Bazz are products', ()=> {
            expect(seed.products.foo.name).to.equal('foo');
            expect(seed.products.bar.name).to.equal('bar');
            expect(seed.products.bazz.name).to.equal('bazz');
        });
        it('a product belongs to a category', () => {
            expect(seed.products.foo.categoryId).to.equal(seed.categories.catFoo.id);
        });
        describe('hook', ()=>{
            it('an empty categoryId will get set to null', async()=>{
                const product = await Product.create({ name: 'quq', categoryId: '' });
                expect(product.categoryId).to.equal(null);
            })
        })
        describe('isExpensive', () => {
            it('a product with a suggestedPrice greater than 10$ is expensive', () => {
                expect(seed.products.foo.isExpensive).to.equal(true); 
            });
            //this way to confirm when price be gteater or less 10$ for test
            it('a product with a suggestedPrice 10$ or less is not expensive', () => {
                expect(Product.build({ suggestedPrice: 10 }).isExpensive).to.equal(false); //this is not existing yet it will be add it or build it
            });
        });
        describe('findAllExpensiveProducts', ()=>{
            it('there is one expensive product', async()=>{
                const expensive = await Product.findAllExpensive();
                expect(expensive.length).to.equal(1);
            });
        });
        describe('Product validation', () => {
            it('name is required', ()=> {
                return Product.create({})//empty name
                    .then(() => { 
                        throw 'noooo'
                    })
                    .catch( ex => expect(ex.errors[0].path).to.equal('name'));//we want this be an error
            });
            it('name can not be an empty string', ()=> {
                return Product.create({name: ''})//empty name
                    .then(() => { 
                        throw 'noooo';
                    })
                    .catch( ex => expect(ex.errors[0].path).to.equal('name'));//we want this be an error
            });
        });
    });
    //Route Testing with Supertest
   describe('API', ()=>{
    describe('GET /api/products', ()=>{
        it('returns the products', () => {
            return app.get('/api/products')//app not define so need to require Supertest and Supertest needs a set of routs, Supertest will spin off its own server, all it needs really is an Express app, needs a way to set to basically determine hey look I'm gonna set up the server Express has this pipeline that handles requests (need to install Supertest dev dependency "npm i supertest --save-dev") and this testing no need listening in app.js file or open browser
            .expect(200)
            .then( response => {//body here is the object will see in console when write console.log(response)
                expect(response.body.length).to.equal(3);
            }) 
        });
    });
    describe('POST /api/products', ()=>{
        it('create a product', () => {
            return app.post('/api/products')
            .send({ name: 'quq', suggestedPrice: 4 })
            .expect(201)
            .then( response => {
                expect(response.body.name).to.equal('quq')
                expect(response.body.isExpensive).to.equal(false);
            }) 
        });
    });
    describe('PUT /api/products', ()=>{
        it('updates a products', () => {
            return app.put(`/api/products/${seed.products.foo.id}`)
            .send({ name: 'FOOO', suggestedPrice: 44 })
            .expect(200)
            .then( response => {
                expect(response.body.name).to.equal('FOOO')
                expect(response.body.isExpensive).to.equal(true);
            }) 
        });
    });
    describe('DELETE /api/products', ()=>{
        it('deletes a product', () => {
            return app.delete(`/api/products/${seed.products.foo.id}`)
            .expect(204);
        });
    });
   });
});