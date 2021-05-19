const jwt = require('jsonwebtoken');

const { secretKeys } = require('../config')

/**
 * 
 * @param {Object} obj Takes the payload as a object convert's it into token
 * @returns JWT Token
 */
exports.generateJwt = obj => jwt.sign(obj, secretKeys.jwt);

/**
 * 
 * @param {Object} json Takes the Json object as a parameter 
 * @returns  Return a Javascript Object
 */
exports.toObject = json => JSON.parse(JSON.stringify(json));

/**
 * 
 * @param {String} str String whose first letter need to be capitalize 
 * @returns String with first letter capitalize
 */
exports.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * 
 * @param {Object} obj 
 * @param {Array} keys 
 * @param {Boolean} defaultFields 
 */
exports.removeFields = (obj, keys, defaultFields = true) => {
    var basicFields = ['deletedAt', 'createdAt', 'updatedAt', 'deletedBy', 'isDeleted'];
    keys = typeof keys == 'string' ? [keys] : keys || [];
    if (defaultFields) keys = keys.concat(basicFields);
    keys.forEach(key => delete obj[key]);
    return obj;
}