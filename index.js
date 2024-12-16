
const {Sequelize, Op } = require('sequelize')
const Order = require('./models/Order');

const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const sequelize = require('./config/database');
const seedDatabase = require('./seeders/seederDB');

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const syncDatabase = async () => {
    try {
      //await sequelize.query('CREATE DATABASE IF NOT EXISTS `restaurant_db`')
      await sequelize.authenticate();
      console.log('Connection established successfully.');
  
      // Sync all models
      await sequelize.sync({ force: true }); // `force: true` will drop and recreate tables
      console.log('All tables created successfully.');
      seedDatabase();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  };
  
  
  syncDatabase();

// Import Routers
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');


app.use(userRoutes);
app.use(menuRoutes);
app.use(orderRoutes);
app.use(reportRoutes);


cron.schedule('*/15 * * * *', async () => {
    try {
        const expiredTime = new Date(Date.now() -4 * 60 * 60 * 1000);
        await Order.update(
            { status: 'expired' },
            { where: { status: 'pending', createdAt: { [Sequelize.Op.lt]: expiredTime } } }
        );
        console.log('Expired orders updated successfully.');
    } catch (error) {
        console.error('Error updating expired orders:', error);
    }
});

//************************************************SERVER START***************************************************** */
  app.get("/",(req,res)=>{
      res.send("hello world");
    });
    
    app.listen(process.env.PORT,()=>{
        console.log(`Server started at ${process.env.PORT}`);
})