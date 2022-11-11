//1.import express karna membutuhkan expres router
import express from "express";
//4.import function dr folder controllesrnya
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} from "../controllers/ProductController.js";

//2.
const router = express.Router();

//5. membuat beberapa route
router.get('/products', getProducts);
router.get('/products:/id', getProductById);
router.post('/products', saveProduct);
router.patch('/products:/id', updateProduct);
router.delete('/products:/id', deleteProduct);
//3.export routernya
export default router; 

//6 import router di index.js