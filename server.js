require("http")
    .createServer(function (req, res) {
        switch (req.url) {
            case "/":
                require("fs").readFile("index.html", function (err, data) {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    res.end(data);
                });
                break;
            case "/three.js":
                require("fs").readFile("three.js", function (err, data) {
                    res.writeHead(200, {"Content-Type": "application/javascript"});
                    res.end(data);
                });
                break;
            case "/zt.rvt.json":
                require("fs").readFile("zt.rvt.json", function (err, data) {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(data);
                });
                break;
            case "/flyControl.js":
                require("fs").readFile("flyControl.js", function (err, data) {
                    res.writeHead(200, {"Content-Type": "application/javascript"});
                    res.end(data);
                });
                break;
            case "/polylineGeometry.js":
                require("fs").readFile("polylineGeometry.js", function (err, data) {
                    res.writeHead(200, {"Content-Type": "application/javascript"});
                    res.end(data);
                });
                break;
            case "/cameras":
                var cameras = ''
                req.on('data', function (c) {
                    cameras += c
                })
                req.on('end', function () {
                    //console.log(cameras)
                    require('fs').writeFile('cameras.json', cameras)
                })

                break;

            case "/getdata":
                require("fs").readFile("cameras.json", function (err, data) {
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(data);
                });
                break;
                console.log(req.url)
        }
    })
    .listen(80);
