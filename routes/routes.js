const Joi = require("joi");
const users = require("../controllers/users");
const groups = require("../controllers/groups");
const expenses = require("../controllers/expenses");
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
                    'name': Joi.string().required()
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
                    'user_id': Joi.string().required()
                }
            }
        }
    },
    {
        path: '/group/{id}',
        method: 'DELETE',
        config: {
            handler: groups.remove,
            auth: 'jwt',
            validate: {
                payload: {
                    'user_id': Joi.string().required()
                }
            }
        }
    },
    {
        path: '/verify/{id}',
        method: 'GET',
        config: {
            handler: users.verify,
            auth: false
        }
    },
    {
        path: '/invite',
        method: 'POST',
        config: {
            handler: users.invite,
            auth: 'jwt',
            validate: {
                payload: {
                    'email': Joi.string().required(),
                    'grp_id': Joi.string().required()
                }
            }
        }
    },
    {
        path: '/expense',
        method: 'POST',
        config: {
            handler: expenses.create,
            auth: 'jwt',
            validate: {
                payload: {
                    'id': Joi.string().required(),
                    'expenses': Joi.array().required()
                }
            }
        }
    },
    {
        path: '/forgotPassword',
        method: 'POST',
        config: {
            handler: users.resetPassword,
            auth: false,
            validate: {
                payload: {
                    email: Joi.string().required()
                }
            }
        }
    },
    {
        path: '/share/{id}',
        method: 'POST',
        config: {
            handler: expenses.create,
            auth: 'jwt',
            validate: {
                payload: {
                    'name': Joi.string().required(),
                    'category': Joi.string().required(),
                    'expenses' : Joi.array().required()
                }
            }
        }
    },
    {
        path: '/share/{id}',
        method: 'GET',
        config: {
            handler: expenses.get,
            auth: 'jwt'
        }
    },
    {
        path: '/share/{id}/{exp}',
        method: 'PUT',
        config: {
            handler: expenses.update,
            auth: 'jwt',
            validate: {
                payload: {
                    'name': Joi.string().required(),
                    'category': Joi.string().required(),
                    'expenses' : Joi.array().required()
                }
            }
        }
    },
    {
        path: '/share/{id}/{exp}',
        method: 'DELETE',
        config: {
            handler: expenses.delete,
            auth: 'jwt'
        }
    }
];