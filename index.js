//1.
import express from "express";
//2.
import FileUpload from "express-fileUpload";
//3.
import cors from "cors";
//9.import router dari folder routes pada file ProductRoute.js
import ProductRoute from "./routes/ProductRoute.js";

//4.
const app = express();

//6.
app.use(cors());
//gunakan express json agar bisa menerima data dlm bentuk format json
app.use(express.json());
app.use(FileUpload());
//10. 
app.use(ProductRoute);

//5.
app.listen(5000, () => console.log('Server Up and Running.....'));

//7. jalankan pada terminal dengan perintah nodemon index untuk mengetahui aplikasi berjalan dengan baik
//8. buat bbrpa forder dan filenya(config,models,routes,contrllers)