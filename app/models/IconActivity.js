const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Icon = new Schema(
    {
        name:       { type: String, maxlength: 255 },
        link:       { type: String, maxlength: 600 },
        type:       { type: String, maxlength: 255 },
        typeOf:     { type: String, maxlength: 255, default: "" },
    },
    {
        timestamps: true,
    },
);

const IconActivity = new Schema(
    {
        name:       { type: String, maxlength: 255 },
        link:       { type: String, maxlength: 600 },
        type:       { type: String, maxlength: 255 },
        icons:      [Icon],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('IconActivity', IconActivity);
