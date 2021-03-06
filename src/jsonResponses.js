//Taken from Week 5B and 6A Demos
// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const fs = require('fs');  // pull in the file system module
const quokesFile = fs.readFileSync(`${__dirname}/../client/quokes.json`);
const quokesArray = JSON.parse(quokesFile).quokes;

//function to respond with a json object
//takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//function to respond without json body
//takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

//return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    quokesArray,
  };

  respondJSON(request, response, 200, responseJSON);
};

//function to add a user from a POST body
const addUser = (request, response, body) => {
  //default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  //check to make sure we have both fields
  //We might want more validation than just checking if they exist
  //This could easily be abused with invalid types (such as booleans, numbers, etc)
  //If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //default status code to 201 created
  let responseCode = 201;

  //if that user's name already exists in our object
  //then switch to a 204 updated status
  if (quokesArray[body.name]) {
    responseCode = 204;
  } else {
    //otherwise create an object with that name
    quokesArray[body.name] = {};
  }

  //add or update fields for this user name
  quokesArray[body.name].name = body.name;
  quokesArray[body.name].age = body.age;

  //if response is created, then set our created message
  //and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

//public exports
module.exports = {
  getUsers,
  addUser,
};
