const express=require("express")
const app=express();
require("dotenv").config();
const mongoose = require("mongoose");
const {router:userRouter}= require("./user")
const cors=require("cors")
const corsConfig = {
  origin: true,
  credentials: true, 
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
}
app.options('', cors(corsConfig))
const books= require("./book")

const uri =
  "mongodb+srv://haroonkhanlala47:XoHkAxN0MxlGlrwU@store.m82ru.mongodb.net/?retryWrites=true&w=majority&appName=store";

  
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(express.urlencoded({extended:false}))
  mongoose.connect(uri, {})
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.error('MongoDB connection error:', err));


    app.git("/",(req,res)=>{
    res.send("hello world")
  });
app.use(userRouter);
app.use(books);

app.listen(process.env.SERVER_PORT,()=>{
    console.log(`server is runing on ${process.env.SERVER_PORT}`);
    
}) 
module.exports = app; // آخر میں یہ لائن شامل کریں
