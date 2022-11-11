//1. import sequelize
import {Sequelize} from "sequelize";

const db = new Sequelize('upload_db', 'root','',{
    host: 'localhost',
    dialect: "mysql"
});

export default db;

//2. buat database di phpmyadmin dengan nama upload_db