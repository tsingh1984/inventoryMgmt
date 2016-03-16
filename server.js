var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('server/routes');
var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

routes(app);

app.use('/todos', express.static(__dirname + '/todos'));
app.use('/inventory', express.static(__dirname + '/inventory'));

app.all('/*', function(req,res,next){
	res.sendFile('index.html', { root: __dirname });
});

app.listen(PORT, function() {
	console.log('Server running on ' + PORT);
});