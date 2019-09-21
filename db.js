const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, DECIMAL, VIRTUAL } = Sequelize;
const EXPENSIVE = 10;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_db', {
    logging: false //to not showing logging when see command app to be clean and just see the result
});

const Product = conn.define('product', {
    id : {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    suggestedPrice: {
        type: DECIMAL,
        defaultValue: 5
    },
    isExpensive: {
        type: VIRTUAL,//virtual that will not save in DB
        get: function(){
            return this.suggestedPrice > EXPENSIVE ? true : false;
        }
    }
}, {
hooks: { //there is number of hooks that you could end up using from them beforeSave  hooks give us way to really do whatever we want to do before an object before certain events so there hooks beforeSavin afterSaving beforeCreating afterCreating beforeUpdating afterUpdating also with deleting as well and even before validation
    beforeSave: function(product){
        if(product.categoryId === ''){
            product.categoryId = null;
        }
    }
}
});


//Class Methods
Product.findAllExpensive = function(){
    //return this.findAll({ where: {isExpensive: true} }) this is not column is  virtual 
    return this.findAll({ where: { suggestedPrice: {[Sequelize.Op.gt]: EXPENSIVE} } });
}

const Category = conn.define('category', {
    id : {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4  
    },
    name: STRING
});

Product.belongsTo(Category);
// Category.hasMany(Product);

const syncAndSeed = async() => {
    await conn.sync({ force: true });

    const categories = [
        {name: 'CatFoo'},
        {name: 'CatBar'},
        {name: 'CatBazz'}
    ];
    const [catFoo, catBar, catBazz] = await Promise.all(categories.map(category => Category.create(category)));

    const products = [
        {name: 'foo', categoryId: catFoo.id, suggestedPrice: 11},
        {name: 'bar', categoryId: catBar.id, suggestedPrice: 10},
        {name: 'bazz', categoryId: catBazz.id, suggestedPrice: 9}
    ];
    const [foo, bar, bazz] = await Promise.all(products.map(product => Product.create(product)));
    return {
        products: {
            foo,
            bar,
            bazz
        },
        categories: {
            catFoo,
            catBar,
            catBazz
        }
    }
};

module.exports = {
    syncAndSeed,
    models: {
        Product,
        Category
    }
};
