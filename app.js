/*eslint-env node*/

var express = require('express');
var app = express();


var cfenv = require('cfenv');


var bodyParser  =   require("body-parser");
var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });
  
//var upload = multer({ dest: './public/images/'});

//app.upload = upload;

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var MongoClient = require('mongodb').MongoClient;

var fs = require("fs");

/**********************  MongoDB Insert and Retrieve APIs  *********************************/

app.get('/listGeo', function (req, res) {
	

	// Connect to the db
	MongoClient.connect("mongodb://user:pwd@host/dbname", function(err, db) {
	  	if(err) {
	   	 console.log("Error connecting to MongoDB");
	  	}
	  	
	  	collectionGet = db.collection('watsoninfo');
	  	
	  	collectionGet.find().toArray(function(err, result) {
	  		
	  		if (err) {
	        console.log(err);
	      } else if (result.length) {
	        console.log('Found:', result);
	      } else {
	        console.log('No document(s) found with defined "find" criteria!');
	      }
	  		
       		res.end(JSON.stringify(result));
       		db.close();
	  	});
	  	
	});
});	

app.post('/addGeo', function (req, res) {
	

	// Connect to the db
	MongoClient.connect("mongodb://user:pwd@host/dbname", function(err, db) {
	  	if(err) {
	   	 console.log("Error connecting to MongoDB");
	  	}
	  	
	  	collectionSend = db.collection('watsoninfo');
	  	
	  	collectionSend.insert(req.body,function (err, result) {
	    if (err) {
	      console.log(err);
	   } else {
	      console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
	    }
	  	
	  	db.close();
	});

   		res.end("{\"result\":\"success\"}");
   });
});


/**********************  Watson Visual Recognition  *********************************/
var watson = require('watson-developer-cloud');

var visual_recognition = watson.visual_recognition({
  api_key: '<your service API key>',
  version: 'v3',
  version_date: '2016-05-20'
});

//Show all watson Classifiers

app.get('/listClassifiers', function (req, res) {

	visual_recognition.listClassifiers({},
		function(err, response) {
		 if (err)
			console.log(err);
		 else
			res.end(JSON.stringify(response, null, 2));
		}
	);
});


//Classiefies a picture


app.post('/test', upload.single('images_file'), function(req, res) {
  	var file = null;

  if (req.file) {
    // file image
    var file = fs.createReadStream(req.file.path);
  } else {
    res.status(400).end("{\"bla\":\"failure\"}");  
  }
  
  
  var file2 = fs.createReadStream('./public/images/bengal-tiger-why-matter_7341043.jpg');
  
   var params = {
    //images_file: file
    images_file: file
  };
  
  //params.classifier_ids = ["Tiger"];

  visual_recognition.classify(params, function(err, results) {
    // delete the recognized file
    if (req.file)
      //fs.unlink(file.path);

    if (err){
      console.log("here 3 ="+ JSON.stringify(err) +" results= " + results);
      res.status(400).end("{\"bla\":\"failure 2\"}");
  }
    else{
        console.log(JSON.stringify(results));
    	res.end(JSON.stringify(results));	
    }
  });
    //res.end("{\"bla\":\"success\"}");
});



// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
