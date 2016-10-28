//Module dependencies

require('dotenv').config()

var express = require('express')
//  , routes = require('./routes')
//  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , errorHandler = require('express-error-handler')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , UserProvider = require('./userprovider').UserProvider;

var app = express();

//app.set('port', process.env.PORT || 3000);
app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(methodOverride());

//In express 4.0 we dont need to specify
//app.use(app.router);

app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

if(process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
}

var userProvider= new UserProvider();

//Routes

//show menu
app.get('/', function(req, res){

	res.render('index', { title: 'Menu' });

});

//show users list
app.get('/users_list', function(req, res){

  userProvider.findAll(function(error, users){
    
		res.render('users_list',
		{ 
			title: 'Users List',
			users: users
		});
  });
});

//show users json
app.get('/users_json', function(req, res){

  userProvider.findAll(function(error, users){
    
    res.json({
        title: 'Users',
        users: users
    });
    return;
  });
});

//show user for update
app.get('/user/:id/edit', function(req, res) {

	userProvider.findById(req.params.id, function(error, user) {
		
		res.render('user_edit',
		{ 
			title: 'Edit User',
			user: user
		});
	});
});

//update user
app.post('/user/:id/edit', function(req, res) {
	
	var userObj = {
			name: req.body.name,
			login: req.body.login,
			password: req.body.password	};

	userProvider.update(
		req.params.id,
		userObj,
		function(error, docs) {

			if (error) {
		    res.json({
		        result: '0',
		        desc: error
		    });
		    return;			
			} else {
		    res.json({
		        result: '1',
		        desc: 'OK'
		    });
		    return;			
			}
			//res.redirect('/')
		});
});

//delete user
app.post('/user/:id/delete', function(req, res) {
	
	userProvider.delete(req.params.id, function(error, docs) {

		if (error) {
	    res.json({
	        result: '0',
	        desc: error
	    });
	    return;			
		} else {
	    res.json({
	        result: '1',
	        desc: 'OK'
	    });
	    return;			
		}
		//res.redirect('/')
	});
});


//new user
app.get('/user/new', function(req, res) {
    res.render('user_new', {
        title: 'New User'
    });
});

//save new user
app.post('/user/new', function(req, res){

	var userObj = {
			name: req.body.name,
			login: req.body.login,
			password: req.body.password	};

	userProvider.save(
		userObj,
		function(error, docs) {

			if (error) {
		    res.json({
		        result: '0',
		        desc: error
		    });
		    return;			
			} else {
		    res.json({
		        result: '1',
		        desc: 'OK'
		    });
		    return;			
			}
			//res.redirect('/')
		});
});


//app.listen(process.env.PORT || 3000);
//app.listen(3000, '0.0.0.0', function() {
app.listen(process.env.PORT, '0.0.0.0', function() {
    console.log('Listening to port:  ' + process.env.PORT);
});
