const express = require('express')
import { Wechaty } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import QrcodeTerminal from 'qrcode-terminal'
const bodyParser = require('body-parser')
const util = require('util')
const vm = require('vm')
var QRCode = require('qrcode')
const redis = require('redis')
const client = redis.createClient( 6379, '127.0.0.1')
client.set('scan_status', 0)
client.set('qrcode', 'null')
const fs = require('fs')

const token = fs.readFileSync('token','utf-8');

const puppet = new PuppetPadplus({
  token,
})

const name  = 'your-bot-name'

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memor                                                                                                                                                                                                                                                       y-card.json and save login data for the next login
})

bot
  .on('scan', (qrcode, status) => {
    console.log(status)
    client.set('scan_status', status);
    if (status === ScanStatus.Waiting) {
      client.set('qrcode', qrcode);
      QrcodeTerminal.generate(qrcode, {
        small: true
      })
    }
  })
  .on('message', msg => {
    const context = {
      msg:msg
    };
    var code = fs.readFileSync('msg.sandbox.js','utf-8');
    const script = new vm.Script(code);
    script.runInNewContext(context);
  })

const app = express()
const port = 3000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/editor', express.static(__dirname + '/node_modules/monaco-editor'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
})

app.get('/api/start', (req, res) => {
  fs.unlink(`${name}.memory-card.json`,(err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('delete ok');
    }
    bot.start()
    res.send('stated')
  });
})

app.get('/api/stop', (req, res) => {
  bot.stop()
  fs.unlink(`${name}.memory-card.json`,(err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('delete ok');
    }
  });
  client.set('scan_status', 0);
  res.send('stoped')
})

app.get('/api/status', (req, res) => {
  client.get('scan_status',function(err,data){
    res.send(data);
  });
})

app.get('/api/qrcode', (req, res) => {
  client.get('qrcode',function(err,data){
    QRCode.toDataURL(data, function (err, url) {
      if(err){
        console.log(err);
      }
      res.send(url)
    })
  });
})

app.get('/api/qrcodeurl', (req, res) => {
  client.get('qrcode',function(err,data){
    res.send(data)
  });
})

app.get('/api/code', (req, res) => {
  var code = fs.readFileSync('msg.sandbox.js','utf-8');
  res.send(code)
})

app.post('/api/code', (req, res) => {
  var code = req.body.code;
  fs.writeFileSync('msg.sandbox.js', code);
  res.send("ok")
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))