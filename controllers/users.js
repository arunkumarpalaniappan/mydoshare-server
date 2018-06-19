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
exports.verify = (request, response) => {
    const params = request.params;
    return Users.verify.call(params)
        .then(user => user)
        .catch(err => Boom.badRequest(err.code));
}
exports.invite = (request, response) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    return Users.inviteUser.call(payload)
        .then(invited => invited)
        .catch(err => Boom.badRequest(err.code))
}
exports.resetPassword = (request, response) => {
    const payload = request.payload;
    return Users.resetPassword.call(payload)
        .then(user => user)
        .catch(err => err);
}