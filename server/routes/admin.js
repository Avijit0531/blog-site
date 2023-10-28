const express=require('express');
const router =express.Router();
const Post=require('../models/Post');
const User=require('../models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const adminLayout='../views/layouts/admin';
const jwtSecret=process.env.JWT_SECRET;
const authMiddleware=(req,res,next)=>{
  const token=req.cookies.token;
  if(!token){
    return res.status(401).json({message:'Unauthorized'});
  }
  try {
    const decoded=jwt.verify(token,jwtSecret);
    req.userId=decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({message:'Unauthorized'});
  }
}
router.get('/admin',async (req,res)=>{
   
    try {
        const t={
            title:"admin",
            description:"Its my first try on Node,Express and Mongo."
        }
        res.render('admin/index',{t,layout:adminLayout});
    } catch (error) {
        console.log(error);
    }
   
});
router.post('/admin',async (req,res)=>{
   
  try {
     const {username,password}=req.body;
     const user=await User.findOne({username});
     if(!user){
      return res.status(401).json(
        {message:'Invalid credentials'}
      );
     }
     const isPasswordValid= await bcrypt.compare(password,user.password);
     if(!isPasswordValid){
      return res.status(401).json(
        {message:'Invalid credentials'}
      );
     }
     const token=jwt.sign({userId:user._id},jwtSecret);
     res.cookie('token',token,{httpOnly:true});
     res.redirect('/dashboard');
  } catch (error) {
      console.log(error);
  }
 
});
router.get('/dashboard',authMiddleware,async(req,res)=>{

try {
  const t={
    title:"dashboard",
    description:"Its my first try on Node,Express and Mongo."
}
const data =await Post.find();
res.render('admin/dashboard',{t,data,layout:adminLayout});
} catch (error) {
  console.log(error);
}

});
router.get('/add-post',authMiddleware,async(req,res)=>{

  try {
    const t={
      title:"Add Post",
      description:"Its my first try on Node,Express and Mongo."
  }
  const data =await Post.find();
  res.render('admin/add-post',{t,layout:adminLayout});
  } catch (error) {
    console.log(error);
  }
  
  });
  router.post('/add-post',authMiddleware,async(req,res)=>{

    try {
    try {
      const newPost=new Post({
        title:req.body.title,
        body:req.body.body
      });
      await Post.create(newPost);
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
   
    } catch (error) {
      console.log(error);
    }
    
    });
    router.get('/edit-post/:id',authMiddleware,async(req,res)=>{

      try {
        const t={
          title:"edit Post",
          description:"Its my first try on Node,Express and Mongo."
      };
       const data=await Post.findOne({_id:req.params.id});
       res.render('admin/edit-post',{
        t,
        data,
        layout:adminLayout
       })
      
      } catch (error) {
        console.log(error);
      }
      
      });
    router.put('/edit-post/:id',authMiddleware,async(req,res)=>{

      try {
       await Post.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        body:req.body.body,
        updatedAt:Date.now()
       });
       res.redirect(`/edit-post/${req.params.id}`);
      } catch (error) {
        console.log(error);
      }
      
      });
    
// router.post('/admin',async (req,res)=>{
   
//     try {
//         res.render('admin/index',{t,layout:adminLayout});
//     } catch (error) {
//         console.log(error);
//     }
   
// });
// router.post('/register',async (req,res)=>{
   
//     try {
//         const{username,password}=req.body;
//         const hashedPassword=await bcrypt.hash(password,10);
//         try {
//            const user=await User.create({username,password:hashedPassword}); 
//            res.status(201).json({mesage:'User Created',user});
//         } catch (error) {
//             if(error.code===11000){
//                 res.status(409).json({message:'user already in use'});
//             }
//             res.status(500).json({message:'internal server error'})
//         }
       
//     } catch (error) {
//         console.log(error);
//     }
   
// });
router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: 'User Created', user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: 'User already in use' });
      } else {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });
router.delete('/delete-post/:id',authMiddleware,async(req,res)=>{
   try {
    await Post.deleteOne({_id:req.params.id});
    res.redirect('/dashboard');
   } catch (error) {
    console.log(error);
   }
});
router.get('/logout',(req,res)=>{
  res.clearCookie('token');
  //res.json({message:'Logout Successful'});
  res.redirect('/');
});

  
module.exports=router;