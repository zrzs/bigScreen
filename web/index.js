const http = require("http");
const Path = require("path");
const fs = require("fs");

var server = http.createServer(function (req, res) {
  const fileName = Path.resolve(__dirname, "." + req.url);
  const extName = Path.extname(fileName).substr(1);

  if (fs.existsSync(fileName)) {
    //判断本地文件是否存在
    var mineTypeMap = {
      html: "text/html;charset=utf-8",
      htm: "text/html;charset=utf-8",
      xml: "text/xml;charset=utf-8",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      css: "text/css;charset=utf-8",
      txt: "text/plain;charset=utf-8",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      ico: "image/x-icon",
      tif: "image/tiff",
      svg: "image/svg+xml",
      zip: "application/zip",
      ttf: "font/ttf",
      woff: "font/woff",
      woff2: "font/woff2",
    };
    if (mineTypeMap[extName]) {
      res.setHeader("Content-Type", mineTypeMap[extName]);
    }
    var stream = fs.createReadStream(fileName);
    stream.pipe(res);
  }
});
console.log('server runing at port 80');
server.listen(80);
