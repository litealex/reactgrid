var Promise = require('es6-promise');
var assign = require('object-assign');

var _callbacks = [];
var _promises = [];

var Dispatcher = function () {
};


Dispatcher.prototype = assign({}, Dispatcher.prototype, {
    register: function (callback) {
        _callbacks.push(callback);
    },
    dispatch: function (payload) {
        _callbacks.forEach(function(callback){
           callback(payload);
        });
    }
});


module.exports = Dispatcher;