const Boom = require("boom");
const Users = require("../models/users");
exports.index = (request,response) => {
    return {http: 200, auth: 'required', api: 401, msg: 'Missing API Key'}
}
exports.authenticateUser = (request) => {
    const payload = request.payload;
    return Users.authenticateUser.call(payload)
        .then(user => user)
        .catch(err => Boom.unauthorized(err));
}
exports.registerUser = (request) => {
    const payload = request.payload;
    return Users.registerUser.call(payload)
        .then(user => user)
        .catch(err => Boom.internal(err));
}
exports.verify = (request) => {
    const params = request.params;
    return Users.verify.call(params)
        .then(user => user)
        .catch(err => Boom.internal(err));
}
exports.invite = (request) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    return Users.inviteUser.call(payload)
        .then(invited => invited)
        .catch(err => Boom.internal(err))
}
exports.resetPassword = (request) => {
    const payload = request.payload;
    return Users.resetPassword.call(payload)
        .then(user => user)
        .catch(err => Boom.internal(err));
}
exports.getNotifications = (request) => {
    const payload = [];
    payload.user = request.auth.credentials;
    return Users.getNotifications.call(payload)
        .then(group => group)
        .catch(err => Boom.internal(err));
}
exports.deleteNotification = (request) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    return Users.deleteNotification.call(payload)
        .then(group => group)
        .catch(err => Boom.internal(err));
}