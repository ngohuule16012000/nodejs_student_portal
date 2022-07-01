const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const image = "https://img.icons8.com/external-flaticons-flat-flat-icons/64/undefined/external-account-e-commerce-flaticons-flat-flat-icons.png";

const Schema = mongoose.Schema;

const Account = new Schema(
    {
        id:         { type: Number },
        name:       { type: String, maxlength: 600 },
        username:   { type: String, maxlength: 255 },
        password:   { type: String, maxlength: 255 },
        department: { type: Boolean, maxlength: 255 },
        category:   [{ type: String, maxlength: 255 }],
        img:        { type: String, maxlength: 255, default: image},
        slug:       { type: String, slug: 'name', unique: false },
    },
    {
        timestamps: true,
    },
);

mongoose.plugin(slug);
Account.plugin(AutoIncrement, {inc_field: 'id'});
Account.plugin(mongooseDelete, { 
    deletedAt : true,
    overrideMethods: 'all' 
});

module.exports = mongoose.model('Account', Account);
