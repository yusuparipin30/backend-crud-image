// //1.import product yang berada di folder model file productModel.js
import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";
 
//2.membuat beberapa function
export const getProducts = async(req, res)=>{
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
 
export const getProductById = async(req, res)=>{
    try {
        const response = await Product.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}
 
export const saveProduct = (req, res)=>{
    //buat kondisi
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    //jika terdapat file maka ambil name dari clien dan simpan dalam variabel name, reques dr body dan terima atribut dr clien dg title
    const name = req.body.title;
    //ambil filenya
    const file = req.files.file;
    //ambil sizenya
    const fileSize = file.data.length;
    //untuk mengambil exstention bisa gunakan path bawaan dr nodejs
    const ext = path.extname(file.name);
    //name yg akan di upload di covert menjadi md5
    const fileName = file.md5 + ext;
    /*membuat url yang akan di simpan di database, protocol akan berisi http atau https
    host berisi localhost apabila di onlinkan akan berubah menjadi domain
    images adalah folder yang nanti di tempalkan di folder public */
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    //tambahkan tipedata yg di ijinkan
    const allowedType = ['.png','.jpg','.jpeg'];
    //validasi jika tdk sesuai dgn typedata yg di ijinkan
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    //kondisi jika file lebih dari 5 mb maka return
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
    //apabila kondisi semua terpenuhi simpan di folder public buat folder public di dlm folde backend
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
    //jika tdk terdapat error makan simpan kedalam database
        try {
    //Product ngambil dari modal, name ngambil dari name, imagenya ngambil dri fileName, urlnya ngambil dari variabel url
            await Product.create({name: name, image: fileName, url: url});
            res.status(201).json({msg: "Product Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })
 
}
 
export const updateProduct = async(req, res)=>{
    //pertama cek apakah data dengan id tertentu terdapat di database?
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    //jika tidak terdapat makan berikan pesan "No Data Found"
    if(!product) return res.status(404).json({msg: "No Data Found"});
     //tambahkan kondisi
    let fileName = "";
    //jika imagenya kosong artinya user hanya mengupdate titlenya ,tanpa mengupdate imagenya
    if(req.files === null){
    //fileName mya ambil dari databasenya . kata Product ini adl dr modalnya (Kapital P)
        fileName = product.image;
    //jika imagenya tidak kosong user mengupdate title dan juga imagenya
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        //jika user mengupdate title dan juga imagenya maka ambil dari file.md5 di tambah dr exstentionnya
        fileName = file.md5 + ext;
        //tambahkan tipedata yg di ijinkan
        const allowedType = ['.png','.jpg','.jpeg'];
        //validasi
        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
        
        //kemudian image yang lama yang terdapat di folder public image perlu di hapus dan ganti image yang baru
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        //ganti image yang baru dari fileName
        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    //simpan ke database
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
     //kemudian simpal kedalam databasenya
    try {
        //Product ngambil dari modal, name ngambil dari name, imagenya ngambil dri fileName, urlnya ngambil dari variabel url
        await Product.update({name: name, image: fileName, url: url},{
            //opsi mengupload berdasarkan id
            where:{
                id: req.params.id
            }
        });
        //jika berhasil tersimpan kedalam database maka berikan respon
        res.status(200).json({msg: "Product Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}
 
export const deleteProduct = async(req, res)=>{
    const product = await Product.findOne({
        where:{
            id : req.params.id
        }
    });
    //validasi apabila tidak ditemukan data dengan id pada table product maka return dan berikan status 404 dan berikan pesan
    if(!product) return res.status(404).json({msg: "No Data Found"});
     //jika datanya di temukan sesuai dengan idnya makan hapus image di dalam folder images dan delet data nya di dlm database
    try {
     // tulis di mana imagenya tersimpan (image adalah dimana file di dlm tabel product)
        const filepath = `./public/images/${product.image}`;
    //hapus image berdasarkan id menggunakan fs(inport fs terlebihdahulu)
        fs.unlinkSync(filepath);
    //hapus datanya yang berada di dlm database 
        await Product.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Product Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

