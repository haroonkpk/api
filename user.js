const express= require("express")
const mongoose =require("mongoose")
const router= express.Router();
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const userschema= mongoose.Schema({
    fullname:{
        type:String,
        require:true
    },
    email:String,
    password:String,
    role:{
        type:String,
        default:"USER"
    },
    books:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"book"
    }]
});

let User = mongoose.model("user",userschema);


router.post("/user",(req,res)=>{
    let {fullname,email,password,role} = req.body;
    console.log(req.body);
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createduser= await User.create({fullname,email,password:hash,role});
            
            res.send(createduser);
        })
    })

})


router.get("/user",async (req,res)=>{
    let appUser=await User.find();

    res.send(appUser);
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  
  if (!existingUser) {
    return res.status(404).send({ message: "User not found" });
  }

  bcrypt.compare(password, existingUser.password, (err, result) => {
    if (result) {
      const token = jwt.sign(
        { email: existingUser.email, role: existingUser.role },
        process.env.JWT_KEY,
        { expiresIn: "166h" }  // Token expiration time
      );
      res.send({
        user: existingUser,
        token: token,
        success: true,
        message: "Login successfuly"
      });
    } else {
      res.status(401).send({ message: "Invalid credentials" });
    }
  });
});



module.exports= {User,router};