const fs = require("fs");

class CartsManager {
    #path;
    #carritos;
    

    constructor(rutaCarrito){
        this.#path = rutaCarrito;
        this.inicializar();
    }

    async inicializar(){
        this.#carritos = await this.#BuscarArchivo();
    }

    #asignarIdCarrito(){
        let id = 1;
        if(this.#carritos.length != 0 ){
            id = this.#carritos[this.#carritos.length - 1].cid + 1;
        }
        return id;
    }

    crearCarrito = async (products) => { 
        const NuevoCarrito = {  "cid": this.#asignarIdCarrito(),
                                "products":products? products :[]
                            };
                            this.#carritos.push(NuevoCarrito);
                            try {
                                await this.#guardarArchivo();
                            return `✅ Nuevo Carrito Agregado ✅`;
                            }
                            catch(error){
                                console.log(error);
                            }
    }

    #BuscarArchivo = async () => { 
        try {
                if(fs.existsSync(this.#path)){
                    return this.#carritos = JSON.parse( await fs.promises.readFile(this.#path, "utf-8"));
                } else {
                    return [];
                }
        } catch(error){
            console.log("Problemas al buscar el archivo ",error);
        }
    }

    #guardarArchivo = async () => { 
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#carritos, null, 5)); 
        } catch(error){
            console.log("Problemas al guardar el archivo ",error);
        }
    }



    getCarritos(){
        return this.#carritos; 
    }

    getCarritotById(cid){
        let carrito = this.#carritos.find((prod)=>prod.cid === cid);
        return carrito? carrito : false; //`🛑 Carrito ID: ${id} Not Found 🛑`
    }

    async updateProduct(cid, pid){
        const carrito = this.#carritos.find((carro) => carro.cid === cid );
        if(carrito){
                let producto = carrito.products.find((prod) => prod.pid == pid);
                if(producto){
                    producto.quantity += 1;
                } else {
                    carrito.products.push({pid:pid, quantity:1 });
                }
            try {
                await this.#guardarArchivo(); 
                return true ; // `Archivo Actualizado`
            }
            catch(error){
                console.log(error.message);
            }
            
        } else {
            return false; // `El carrito con el id: ${cid} no existe`
        }
    }

    async deleteCarrito(pid){
        const index = this.#carritos.findIndex((carrit) => carrit.id === pid );
        if(index >= 0 ){
            this.#carritos =  this.#carritos.filter(produc => produc.id !== pid);
            try {
                await this.#guardarArchivo();
                return true; //`Producto Eliminado Correctamente ✅`
            }
            catch(error){
                return false; //"Error al elinminar el producto";
            }
            
        } else {
            return false; //`🛑 El producto con el Id ${id} no existe`
        }
    }

}

module.exports = CartsManager;