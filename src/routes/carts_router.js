const Router = require("express");
const router = Router();
const path = require("path");


const rutaCartsManager = "/Applications/MAMP/htdocs/ClaseBackend/Desafio4/src/classes/CartsManager.js";
const CartsManager = require(rutaCartsManager);
const RutaCarrito = "/Applications/MAMP/htdocs/ClaseBackend/Desafio4/src/data/carrito.js";


const entorno = async () => { //abriendo entorno async
    const carrito = new CartsManager(RutaCarrito);
    try{
        await carrito.inicializar();
        
    }
    catch(error){
        console.log(error.message);
        return
    }


    router.post("/", async (request, response) => {
    
        let {products} = request.body; 
        
        if(!products){
            response.setHeader('Content-Type','application/json');
            return response.status(400).json({status:"error", error:"Debe Agregar productos al carrito 🛑"});
        } else {
            let agregado = await  carrito.crearCarrito(products);
            if(agregado){
                try {
                    response.setHeader('Content-Type','application/json');
                    response.status(200).json({status:"succes", message:"Producto Agregado correctamente ✅"})
                } catch(error){
                    response.setHeader('Content-Type','application/json');
                    response.status(400).json({status:"error", message:"El producto no se pudo agregar"})
                }
            }
        }
    });

    router.post("/:cid/product/:pid", async (request, response) => {
        let cid = request.params.cid;
        let pid = request.params.pid;
        let carritos = carrito.getCarritos();
        cid = Number(cid);
        pid = Number(pid);
        if(isNaN(cid) || isNaN(pid) ){
            response.setHeader('Content-Type','application/json');
            response.status(400).json({error:"Ingrese un cid y pid numéricos"});
        } else {
            let hecho = carrito.updateProduct(cid,pid);
            if(hecho){
                response.setHeader('Content-Type','application/json');
                response.status(200).json({status:"succes", message:"Producto Agregado Satisfactoriamente"});
            } else {
                response.setHeader('Content-Type','application/json');
                response.status(400).json({status:"error", message:"No se pudo agregar el producto"});
            } 
            
        }
    });



    router.get("/:cid",(request, response) => {
        let carritos = carrito.getCarritos();
        let cid = request.params.cid;
        cid = Number(cid);
        if(isNaN(cid)){
            response.setHeader('Content-Type','application/json');
            response.json({error:"Ingrese un ID numérico"});
        } else {
            let carro = carritos.find((cart)=> cart.cid == cid );
            if(carro){
                response.setHeader('Content-Type','application/json');
                response.status(200).json(carro.products);
            } else {
                response.setHeader('Content-Type','application/json');
                response.status(400).json({error:`No existe carrito con el ID ${cid}`});
            }
        }
    });

    router.get("/", (request, response) => {
        response.setHeader('Content-Type','application/json');
        response.status(200).json({mensaje:"Estamos en Carts"});
        
    });



} //cerrando entorno async

entorno();


module.exports = router;