const express=require('express');
const router =express.Router();
const Post=require('../models/Post');
router.get('',async(req,res)=>{  
    try {
        const t={
            title:"Blog Website",
            description:"Its my first try on Node,Express and Mongo."
        }
        let perPage=5;
        let page=req.query.page||1;
        const data=await Post.aggregate([{$sort:{createdAt:-1}}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();
        const count=await Post.count();
        const nextPage=parseInt(page)+1;
        const hasNextPage=nextPage<=Math.ceil(count/perPage);
        res.render('index',{t,data,current:page,nextPage:hasNextPage?nextPage:null,currentRoute:'/'});
    } 
    catch (error) {
        console.log(error);
    }
});
router.post('/search',async(req,res)=>{  
    try {
        const t={
            title:"Search",
            description:"Its my first try on Node,Express and Mongo."
       }
       let searchTerm=req.body.searchTerm;
       const searchNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"")
       const data= await Post.find({
        $or:[
            {title:{$regex:new RegExp(searchNoSpecialChar,"i")}},
            {body:{$regex:new RegExp(searchNoSpecialChar,"i")}}
        ]
       });
       
        res.render("search",{
            data,
            t,
            currentRoute:'/search'
        });
    } catch (error) {
        console.log(error); 
    }
       
});
router.get('/post/:id',async(req,res)=>{  
   
    try {
      
       let slug=req.params.id;
        const data= await Post.findById({_id:slug});
        const t={
            title:data.title,
            description:"Its my first try on Node,Express and Mongo."
       }
        res.render('post',{t,data,currentRoute:`/post/${slug}`});
    } catch (error) {
        console.log(error); 
    }
       
});



router.get("/about",(req,res)=>{
    const t={
        title:"Blog Website",
        description:"Its my first try on Node,Express and Mongo."
    }
    res.render('about',{t,currentRoute:'/about'});
})
// function insertPostData(){
//     Post.insertMany([
//         {
//             title:"Building a blog",
//             body:"This is the body text"
//         },
//         {
//             title:"build real-time, event driven application in Node.js",
//             body:"Socket.io:Learn how to use Socket.io to buil real-time, event-driven application in Node.js"
//         },
//         {
//             title:"What are Streams in Node Js?",
//             body:"Streams are abstract interfaces for working with data that can be read or written sequentially. In Node.js, streams are a fundamental concept used to handle data flow between input and output sources."
//         },
//         {
//             title:"node js",
//             body:"Node.js is an open-source, server-side runtime environment that allows you to execute JavaScript code outside of a web browser. It is built on the V8 JavaScript engine, which is also used by the Google Chrome browser."
//         },
//         {
//             title:"Application ",
//             body:"Web applications: Node.js is well-suited for building web applications and APIs. With frameworks like Express.js, you can create robust and scalable server-side applications that handle HTTP requests, process data, and interact with databases."
//         },

//     ])
// }
// insertPostData();
module.exports=router;