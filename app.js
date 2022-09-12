const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

function capitalize(input){
  return input.slice(0,1).toUpperCase() + input.slice(1).toLowerCase();
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res){
  const query = req.body.cityName;
  const unit = 'imperial';
  const apiKey = '6140656c02848d1d60e31fc567af9cb3';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;

  https.get(url, function(response) {
    console.log(response.statusCode);
    
    response.on('data', function (data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png"`;
      res.write(`<h1>The temperature in ${capitalize(query)} is ${temp} degrees Farenheit.</h1>`);
      res.write(`<p>Weather Description: ${capitalize(weatherDescription)}.</p>`);
      res.write(`<img src="${imageURL}">`);
      res.send();
    });
  });
});






app.listen(3000, function() {
  console.log('Server is running on port 3000.');
});
