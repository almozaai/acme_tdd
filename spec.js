/*
  test-drevin development 
  for Sequelize Models and Express Routs
  just to explain the importance of of dooing testing that to allow us to be able to write some code rapidly in sense that we're not gonna have to open up browser
  we be able to the document how the think our system is going to behave
  and move retively quickly the test
  no only help us get up code written but it's gonna help us mentain our code as we end up writing more code if we know have a problem 

  npm init -y
  to model needing to do the testing 
  npm i mocha chai --save-dev
  mocha testing framework 
  chai searching library

  --save-dev
  it will indicate that when I end up going to deploy my application these are not libraries that I need 
  these are libraries that I'm going to use for the development part of my application 

  go to the package.json and change test to "test:dev": "mocha spec.js --watch"
  by --watch will mak the test rerunning every time file change
  write the code 'npm run test:dev'
*/
const { expect } = require('chai');
const db = require('./db');
const { Product, Category } = db.models;
describe('Acme TDD', () => {
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
        describe('Product validation', () => {
            it('name is required', ()=> {
                return Product.create({});
            });
        });
    });
});