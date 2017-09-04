var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

var REQUEST_ID = 0;

function logReq(req) {
  var obj = {
    url: req.url,
    headers: req.headers,
    method: req.method,
    params: req.params,
    query: req.query,
    time: Date.now(),
    body: req.body,
  }
  console.log(obj);
}

app.all('/demo/xhrtest', function(req, res) {
  logReq(req);

  // var ifNoneMatch = req.headers['if-none-match'];
  // if(ifNoneMatch) {
  //   res.setHeader('Cache-Control', 'public,max-age=20');
  //   res.status(304).end();
  //   return;
  // }

  //res.setHeader('Cache-Control', 'public,max-age=20');

  setTimeout(() => {
    console.log('xxxxx');
    res.json({
      xhrtest: 'xhrtest',
      time: Date.now(),
    });
  }, 5000);

});

app.get('/demo/listview1', function(req, res) {
  var query = req.query;
  console.log('/demo/listview1 ' + JSON.stringify(query));
  var data;
  if(Math.random() > 0.8) {
    data = {

    };
  } else {
    var index = parseInt(query.index, 10) || ++REQUEST_ID;
    var items = [];
    for(var i = 0; i < 15; ++i) {
      items.push({
        text: i + index,
        ui_type: 'test.SimpleListItem',
      });
    }
    var nextIndex = index + 15;
    data = {
      items: items,
      nextUrl: 'http://' + req.headers.host + '/demo/listview1?index=' + nextIndex
    };
    if(Math.random() > 0.9) {
      data.nextUrl = null;
    }
  }

  //res.setHeader('Cache-Control', 'no-cache');
  setTimeout(function() {
    res.json(data);
  }, Math.random() * 2000);
});

app.get('/demo/search1', function(req, res) {
  var query = req.query;
  console.log('/demo/search1 ' + JSON.stringify(query));
  var data;
  if(Math.random() > 0.6) {
    data = {

    };
  } else {
    var index = parseInt(query.index, 10) || ++REQUEST_ID;
    var items = [];
    for(var i = 0; i < 15; ++i) {
      items.push({
        text: query.key + (i + index),
        ui_type: 'test.SimpleListItem',
      });
    }
    var nextIndex = index + 15;
    data = {
      items: items,
      nextUrl: 'http://' + req.headers.host + '/demo/search1?index=' + nextIndex + '&key=' + query.key
    };
    if(Math.random() > 0.9) {
      data.nextUrl = null;
    }
  }

  //res.setHeader('Cache-Control', 'no-cache');
  setTimeout(function() {
    res.json(data);
  }, Math.random() * 1000);
});

app.get('/demo/dynamicmap', function(req, res) {
  var query = req.query;
  console.log('/demo/dynamicmap ' + JSON.stringify(query));

  const AVATARS = [
    'http://imgsrc.baidu.com/forum/w%3D580/sign=2535219b8882b9013dadc33b438ca97e/572c11dfa9ec8a1389ee5d5cf503918fa1ecc092.jpg',
    'http://www.qq1234.org/uploads/allimg/150403/1025192145-7.jpg',
    'http://www.qq1234.org/uploads/allimg/150403/1025193439-11.jpg',
    'http://img0.imgtn.bdimg.com/it/u=2572502082,4096863058&fm=214&gp=0.jpg',
    'http://www.qq1234.org/uploads/allimg/150403/1025195952-8.jpg',
    'http://imgsrc.baidu.com/forum/w%3D580/sign=54c8751cf403738dde4a0c2a831ab073/9b388213b07eca8088f1335b932397dda04483bb.jpg',
    'http://www.qq1234.org/uploads/allimg/150403/103J4L44-1.jpg',
  ];

  var bounds = query.bounds;
  var minmax = bounds.split(';');
  var min = minmax[0].split(',');
  var max = minmax[1].split(',');

  var minX = Number(min[0]);
  var minY = Number(min[1]);
  var maxX = Number(max[0]);
  var maxY = Number(max[1]);

  var points = [];
  var gridSize = 0.05;
  minX = Math.ceil(minX / gridSize) * gridSize;
  minY = Math.ceil(minY / gridSize) * gridSize;
  for (var x = minX; x < maxX; x += gridSize) {
    for (var y = minY; y < maxY; y += gridSize) {
      if (x < 105 || x > 107) {
        points.push({
          id: `${x}-${y}`,
          x,
          y,
          a: AVATARS[(Math.random() * AVATARS.length) << 0],
          title: `${x}-${y}`,
        });
      }
    }
  }
  
  setTimeout(function() {
    res.json({
      CODE: 'ok',
      DATA: {
        list: points.sort(() => Math.random() - 0.5),
      },
    });
  }, Math.random() * 2000);
});

var server = app.listen(3003, function() {
  var port = server.address().port;
  console.log('Server started: http://localhost:' + port + '/');
});
