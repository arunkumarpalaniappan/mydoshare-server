const Boom = require("boom");
const Groups = require("../models/groups")
exports.create = (request) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    return Groups.create.call(payload)
        .then(group => group)
        .catch(err => Boom.gatewayTimeout(err));
}
exports.get = (request) => {
    const params = request.params;
    return Groups.get.call(params)
        .then(group => group)
        .catch(err => Boom.gatewayTimeout(err));
}
exports.update = (request) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    const params = request.params;
    return Groups.update.call({_id:params.id,user:payload.user_id})
        .then(res => res)
        .catch(err => Boom.gatewayTimeout(err));
}
exports.remove = (request) => {
    const payload = request.payload;
    const params = request.params;
    return Groups.remove.call({_id:params.id,user:payload.user_id})
        .then(removed => removed)
        .catch(err => Boom.gatewayTimeout(err));
}