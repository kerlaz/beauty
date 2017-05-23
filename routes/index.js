var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/thelist', function (req, res, next) {
    var MongoClient = mongodb.MongoClient;

    var url = 'mongodb://localhost:27017/inkodabeauty';
    
    MongoClient.connect(url,function (err, db) {
        if (err){
            console.log('Unable to connect to the server.')
        } else {
            console.log('Connection established');

            var masters = db.collection('masters');
            // var services = db.collection('services');

            // masters.find({}).toArray(function (err, result) {
            masters.aggregate([{
                $lookup:{
                    from:'services',
                    localField:'services',
                    foreignField:'_id',
                    as:'services'
                }
            }]).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else if (result.length){
                    console.log(result);
                    res.render('masterlist',{
                        "masterlist":result
                    });
                } else {
                    res.send('No document found');
                }
                db.close();
            })
        }
    })
});

module.exports = router;
