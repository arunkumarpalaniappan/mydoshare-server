const Boom = require("boom");
const Users = require("../models/users");
exports.index = (request,response) => {
    return {online: true}
}
exports.authenticateUser = (request, response) => {
    const payload = request.payload;
    return Users.authenticateUser.call(payload)
        .then(user => user)
        .catch(err => Boom.badRequest(err.code));
}

exports.registerUser = (request, response) => {
    const payload = request.payload;
    return Users.registerUser.call(payload)
        .then(user => user)
        .catch(err => Boom.badRequest(err.code));
}
