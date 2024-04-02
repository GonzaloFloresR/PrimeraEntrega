const express = require("express");
const productsRouter = require("./routes/products_routers.js");
const cartRouter = require("./routes/carts_router.js");

const PORT = 8080;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 

app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartRouter); 


app.listen(PORT, () => console.log(`Server online en puerto ${PORT}`)); 