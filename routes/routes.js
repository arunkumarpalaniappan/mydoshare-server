const Joi = require("joi");
const users = require("../controllers/users");
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
                    'password': Joi.string().required()                    
                }
            }
        }
    }
];