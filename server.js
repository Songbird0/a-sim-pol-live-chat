const express = require("express");
const app = express();
const chat = require("./back/db");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const moment = require("moment");
require("moment/locale/fr");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ "extended": true }));
app.use("/components", express.static("views"));
app.use("/commons", express.static("commons"));
app.set("view engine", "pug");

app.use('/', (request, response, next) => {
  if (request.method === "GET") {
    console.log(chat);
    const remoteMessageList = chat.db.prepare("SELECT * FROM messages;");
    const messageList = remoteMessageList.all();

    response.render("live-chat/chat", {
      "messageList": messageList,
      "isRegistered": false
    }, (err, html) => {
      if (err) {
        let unexpectedBehaviour = createError(500,
`
Something went wrong while sending html.
HTTP method: GET
Error: ${err}
`.trim());
        next(unexpectedBehaviour);
      }
      else {
        response.send(html);
      }
    });
  }

  if (request.method === "POST") {
    
    if (request.body.registration) {
      const wishedUsername = request.body.wishedUsername;
    
      if (!(wishedUsername && wishedUsername.length > 0)) {
        return next(createError(403, "Please enter a valid username."));
      }
    
      if(request.cookies.username) {
        return next(createError(403, "You're already registered."));
      }
      
      let expirationDate = (() => {
        let oneDayLater = moment().add(1, "days");
        return new Date(oneDayLater.year(),
                 oneDayLater.month(), 
                 oneDayLater.date());
      })();
      console.log(`expiration date: ${expirationDate}
typeof expiration date: ${typeof expirationDate}`);
      
      response.cookie("username", wishedUsername, {"expires": expirationDate, "httpOnly": true });
      const remoteMessageList = chat.db.prepare("SELECT * FROM messages;");
      const messageList = remoteMessageList.all();

      return response.render("live-chat/chat", {
        "messageList": messageList,
        "isRegistered": true
      }, (err, html) => {
        if (err) {
          let unexpectedBehaviour = createError(500,
`
Something went wrong while sending html.
HTTP method: GET
Error: ${err}
`.trim());
          return next(unexpectedBehaviour);
        }
        response.send(html);
      });
    }
    else {
      const userTextMessage = request.body.userTextMessage;
      if (userTextMessage && userTextMessage.length > 0) {
        const userTextMessageSaving = chat.db.prepare("INSERT INTO messages(date, username, content) VALUES (?, ?, ?);");
        const info = userTextMessageSaving.run(moment().format(), request.cookies.username, userTextMessage);
        
        console.log(`${info.changes} rows were modified.`);
        const remoteMessageList = chat.db.prepare("SELECT * FROM messages");
        const messageList = (() => {
          let messageList = remoteMessageList.all();
          return messageList.map((message) => {
            let wrapper = moment(message.date);
            let humanReadableDate = `${wrapper.hour()}:${wrapper.minute()}:${wrapper.second()}`;
            return {
              "date": humanReadableDate,
              "username": message.username,
              "content": message.content
            };
          });
        })();
        
        return response.render("live-chat/chat", {
          "messageList": messageList,
          "isRegistered": true
        });
      }
      else {
        next(createError(403, "The user text message cannot be null, undefined or empty. Try again please."));
      }
    }
  }
});

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  response.locals.error = request.app.get("env") === "development" ? err : {};

  response.status(err.status || 500);
  response.render("errors/generic-error");
});

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});