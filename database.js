// const {Sequelize} = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE, process.env.MYSQL_USER , process.env.MYSQL_PASSWORD, {
//   host: process.env.MYSQL_HOST,
//   dialect: 'mysql',
//   port: process.env.MYSQL_PORT,
//   define: { 
//       timestamps: true,
//       underscored: true,
//       createdAt: 'created_at',
//    }
// });

// module.exports = sequelize; ONLINE


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        // O valor do MYSQL_PORT é lido como uma string ('10042') do arquivo .env.
        // O Sequelize geralmente precisa que 'port' seja um número,
        // então usamos parseInt() para garantir a conversão.
        port: parseInt(process.env.MYSQL_PORT, 10), 
        
        // Você pode definir o dialect aqui como 'mysql', mas é mais seguro
        // buscar a variável de ambiente, caso você queira trocá-la no futuro.
        dialect: process.env.MYSQL_DIALECT, 
        
        define: { 
            timestamps: true,
            underscored: true,
            createdAt: 'created_at',
        },
        // Adicionando logging para ver as queries (opcional, mas útil para debug)
        // logging: console.log, 
    }
);

module.exports = sequelize;