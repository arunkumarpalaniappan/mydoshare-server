const fs = require("fs");

const data = {
    "serverConf": {
      "port": process.env.PORT || 6000,
      "host": "0.0.0.0"
    },
    "jwt": {
      "key": "mydoshare@arunkumarpalaniappan.me",
      "alg": "HS256"
    },
    "log":{
      "name": "log",
      "logConfig":{
        "level": "debug",
        "type": "raw",
        "src": true
      }
    },
    "db": {
        "user": process.env.DB_USER || "arunkumar",
        "pwd": process.env.DB_PWD || "password",
        "host": process.env.DB_HOST || "localhost",
        "name": process.env.DB_NAME || "mydoshare"
    }
  }

fs.writeFileSync('./config/default.json',JSON.stringify(data));