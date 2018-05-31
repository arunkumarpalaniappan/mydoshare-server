const mongoose = require("mongoose");
const config = require('config');

const options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};

mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.pwd}@${config.db.host}/${config.db.name}`).connection;

const Schema = mongoose.Schema;

const _users = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    grps: {
        type: Array,
        default: []
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {strict: true});

exports._usersSchema = mongoose.model('_users', _users);

const _groups = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: Array,
        required: true
    }
}, {strict: true});

exports._groupsSchema = mongoose.model('_groups', _groups);

const groupExpenses = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    total: {
        type:Float64Array,
        required: true
    },
    paidBy: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {strict: false});

exports._customSchema = (groupid) => mongoose.model(`group_${groupid}`,groupExpenses);