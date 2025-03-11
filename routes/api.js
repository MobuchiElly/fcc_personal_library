'use strict';

const { getDB } = require("../connection");
const { ObjectId } = require("mongodb");

module.exports = function (app) {
  app.route('/api/books')
    .get(async function (req, res){ 
      try{
        const db = await getDB();
        const jsonRes = await db.collection('personal_library').find().toArray();
        if (jsonRes.length == 0) return res.status(404).json("no books in database"); 
        return res.status(200).json([...jsonRes]);
      } catch(err){
        res.status(500).json({"error": "unable to access database"});
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      const comments = [];
      if(!title) return res.status(200).json("missing required field title");
      try{
        const db = await getDB();
        const bookRes = await db.collection('personal_library').insertOne({
          title,
          comments,
          "commentcount": comments.length 
        });
        return res.status(201).json({"_id":bookRes.insertedId, title});
      } catch(err){
        res.status(500).json("a server error occurred");
      }
    })
    
    .delete(async function(req, res){
      try {
        const db = await getDB();
        const deleteRes = await db.collection('personal_library').deleteMany({});
        if (deleteRes.deletedCount == 0) return res.status(400).json({"error": "unable to delete book"});
        return res.status(200).json("complete delete successful");
      } catch(err){
        res.status(500).json({"error": "unable to delete book"})
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = new ObjectId(req.params.id);
      if(!bookid) return res.status(404).json("required field bookid missing");
      try{
        const db = await getDB();
        const bookRes = await db.collection('personal_library').findOne({_id:bookid});

        if (!bookRes) return res.status(201).json("no book exists");
        
        const {commentcount, ...data} = bookRes;
        return res.status(200).json({...data});
      } catch(err){
        res.status(500).json("no book exists");
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) return res.status(200).json("missing required field comment");
      try {
        const db = await getDB();
        const postRes = await db.collection("personal_library").findOneAndUpdate({"_id": new ObjectId(bookid)}, 
        {$push: {comments: comment}},
        { returnDocument: "after"}
        );
       if (!postRes) return res.status(200).json("no book exists");
        const { commentcount, ...data } = postRes;
        return res.status(201).json({...postRes});
      } catch(err){
        res.json("error")
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      if(!bookid) return res.status(404).json('missing required field _id')
      try {
        const db = await getDB();
        const deleteRes = await db.collection("personal_library").deleteOne({"_id": new ObjectId(bookid) });
        if(deleteRes.deletedCount == 0) return res.status(201).json('no book exists');
        return res.status(200).json("delete successful");
      } catch(err){
        res.status(500).json("a server error ocuurred");
      }
    });  
};
