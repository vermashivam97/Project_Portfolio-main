let mongoose = require('mongoose');

//create model class

let contactListModel = mongoose.Schema(
    {
        name: String,
        contact_number: String,
        email: String
    },
    {
        collection : "contacts"
    }
);

module.exports = mongoose.model('contactlist', contactListModel);