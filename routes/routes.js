const Joi = require("joi");
const users = require("../controllers/users");
const groups = require("../controllers/groups");
module.exports = [
    {
        path: '/',
        method: 'GET',
        config: {
            handler : users.index,
            auth: false
        }
    },
    {
        path: '/login',
        method: 'POST',
        config : {
            handler : users.authenticateUser,
            auth: false,
            validate : {
                payload : {
                    'email': Joi.string().required(),
                    'password': Joi.string().required()
                }
            }
        }
    },
    {
        path: '/signup',
        method: 'POST',
        config : {
            handler : users.registerUser,
            auth: false,
            validate : {
                payload : {
                    'name': Joi.string().required(),
                    'email': Joi.string().required(),
                    'password': Joi.string().required(),
                    'grps': Joi.array().optional(),
                    'verified': Joi.bool().optional()                    
                }
            }
        }
    },
    {
        path: '/group',
        method: 'POST',
        config: {
            handler: groups.create,
            auth: 'jwt',
            validate: {
                payload: {
                    'name': Joi.string().required(),
                    'users': Joi.array().required()
                }
            }
        }
    },
    {
        path: '/group/{id}',
        method: 'GET',
        config: {
            handler: groups.get,
            auth: 'jwt'
        }
    },
    {
        path: '/group/{id}',
        method: 'PUT',
        config: {
            handler: groups.update,
            auth: 'jwt',
            validate: {
                payload: {
                    'users': Joi.array().required()
                }
            }
        }
    }
];