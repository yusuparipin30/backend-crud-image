//1. import sequelize
import {Sequelize} from "sequelize";
//2.import db untuk koneksi database yang di folder config file Database.js
import db from "../config/Database.js";
//3.
const {DataTypes} = Sequelize;
//4.
const Product = db.define('product',{
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING
},{
    freezeTableName:true
});
//5.
export default Product;

//6.membuat fungsi untuk membuat table product apabila tidak terdapat di database
(async()=>{
    await db.sync();
})();


