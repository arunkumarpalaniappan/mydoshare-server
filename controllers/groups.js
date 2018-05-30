const Boom = require("boom");
const Groups = require("../models/groups")
exports.create = (request,response) => {
    const payload = request.payload;
    return Groups.create.call(payload)
        .then(group => group)
        .catch(err => Boom.badRequest(err.code));
}