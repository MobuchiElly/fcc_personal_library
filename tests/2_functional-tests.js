const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    let _id = '';
    const _invalid_id = new ObjectId(1234101727);

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            "title": "Things fall apart"
          })
          .end((err, res) => {
            _id = res.body._id;
            assert.isObject(res.body);
            assert.equal(res.status, 201);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'Things fall apart')
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({

          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, 'missing required field title');
            done();
          })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.isArray(res.body);
            assert.equal(res.status, 200);
            res.body.forEach(book => {
              assert.property(book, '_id');
              assert.property(book, 'title');
            })
            done();
          })
      });            
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/' + _invalid_id)
          .end((err, res) => {
            assert.isString(res.body);
            assert.equal(res.status, 201);
            assert.equal(res.body, 'no book exists')
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .get('/api/books/' + _id)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          assert.property(res.body, 'comments');
          assert.property(res.body, 'title');
          assert.equal(res.body._id, _id);
          done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post('/api/books/' + _id)
        .send({
          comment: "testing comments"
        })
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.property(res.body, '_id');
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          assert.isArray(res.body.comments, 'comments property should be an array of coments');
          assert.equal(res.body.comments.includes('testing comments'), true);
          done();
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .post('/api/books/' + _id)
        .send({

        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'missing required field comment');
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .post('/api/books/' + _invalid_id)
        .send({
          "comment": "testing comments"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done();
        })
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .delete('/api/books/' + _id)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'delete successful');
          done();
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete('/api/books/' + _invalid_id)
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done();
        })
      });
    });
  });
});
