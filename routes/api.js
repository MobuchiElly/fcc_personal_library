/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { getDB } = require("../connection");

module.exports = function (app) {
// (async function dbConnect(){
//   const db
// })();   // would call the route only after connecting to db
  app.route('/api/books')
    .get(async function (req, res){ 
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      res.send("testing get route")
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      
      if(!title) return res.status(200).json("missing required field title");

      const db = await getDB();
      const bookRes = await db.collection('personal_library').insertOne({
        "title": title
      });
      console.log("bookRes: ", bookRes);
      res.status(201).json({"_id":bookRes.insertedId, ...bookRes});
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      console.log("testing delete route");
      res.send("testing delete route");
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log("testing post:id route");
      res.send("testing post:id route");
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      console.log("testing post:id route");
      res.send("testing post:id route");
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      console.log("testing post:id route");
      res.send("testing post:id route");
    });
  
};
