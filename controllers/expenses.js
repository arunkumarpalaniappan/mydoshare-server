const Boom = require("boom");
const Expenses = require("../models/expenses")
exports.create = (request,response) => {
    const payload = request.payload;
    payload.user = request.auth.credentials;
    return Expenses.create.call(payload)
        .then(group => group)
        .catch(err => err);
}