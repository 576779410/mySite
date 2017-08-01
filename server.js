require("http")
  .createServer(function(req, res) {
    switch (req.url) {
      case "/":
        require("fs").readFile("index.html", function(err, data) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
        break;
    }
  })
  .listen(80);