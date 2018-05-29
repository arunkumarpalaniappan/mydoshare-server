const Boom = require("boom");
const Login = require("../models/login");

exports.authenticateUser = (request, response) => {
    const payload = request.payload;
    return Login.authenticateUser.call(payload)
        .then(user => user)
        .catch(err => err);
}