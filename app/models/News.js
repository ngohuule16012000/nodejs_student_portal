const mongoose = require('mongoose');

const image = "https://img.icons8.com/external-flaticons-flat-flat-icons/64/undefined/external-account-e-commerce-flaticons-flat-flat-icons.png";

const Schema = mongoose.Schema;

const News = new Schema(
    {
        content:        { type: String, maxlength: 600 },
        viewing:        { type: String, maxlength: 255 },
        filetoupload:   [{ type: String, maxlength: 255 }],
        basic:          {},
    },
    {
        timestamps: true,
    },
);

News.query.sorttable = function()
{
    return this.sort({
        ['createdAt']: 'desc',
    });
}

module.exports = mongoose.model('News', News);
