const Boom = require("boom");
const Expenses = require("../models/expenses")
exports.create = (request) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    const params = request.params;
    return Expenses.create.call({_id:params.id,payload})
        .then(group => group)
        .catch(err => Boom.gatewayTimeout(err));
}
exports.get = (request) => {
    const params = request.params;
    return Expenses.get.call(params)
        .then(group => group)
        .catch(err => Boom.gatewayTimeout(err));
}
exports.update = (request) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    const params = request.params;
    return Expenses.update.call({_id:params.id, exp: params.exp ,payload})
        .then(group => group)
        .catch(err => Boom.gatewayTimeout(err));
}
exports.delete = (request) => {
    const payload = {};
    payload.user = request.auth.credentials;
    const params = request.params;
    return Expenses.delete.call({_id:params.id, exp: params.exp ,payload})
        .then(group => group)
        .catch(err => Boom.gatewayTimeout(err));
}