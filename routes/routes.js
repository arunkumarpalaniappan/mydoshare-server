const Joi = require("joi");
const login = require("../controllers/login");
module.exports = [
    {
        path: '/login',
        method: 'POST',
        config : {
            handler : login.authenticateUser,
            auth: false,
            validate : {
                payload : {
                    'email': Joi.string().required(),
                    'password': Joi.string().required()
                }
            }
        }
    },
    // {
    //     path: '/signup',
    //     method: 'POST',
    //     config : {
    //         handler : login.registerUser,
    //         auth: false,
    //         validate : {
    //             payload : {
    //                 'name': Joi.string().required(),
    //                 'email': Joi.string().required(),
    //                 'password': Joi.string().required()                    
    //             }
    //         }
    //     }
    // }
];