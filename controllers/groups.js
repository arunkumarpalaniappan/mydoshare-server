const Boom = require("boom");
const Groups = require("../models/groups")
exports.create = (request,response) => {
    const payload = request.payload;
    return Groups.create.call(payload)
        .then(group => group)
        .catch(err => Boom.badRequest(err.code));
}
exports.get = (request,response) => {
    const params = request.params;
    return Groups.get.call(params)
        .then(group => group)
        .catch(err => Boom.badRequest(err.code));
}
exports.update = (request,response) => {
    const payload = request.payload;
    const params = request.params;
    return Groups.update.call({_id:params.id,users:payload.users})
        .then(res => res)
        .catch(err =>err);
}