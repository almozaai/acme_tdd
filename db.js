const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_tdd_db', {
    logging: false
});

const Product = conn.define('product', {
    id : {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: STRING
});

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
        {name: 'foo', categoryId: catFoo.id},
        {name: 'bar', categoryId: catBar.id},
        {name: 'bazz', categoryId: catBazz.id}
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
