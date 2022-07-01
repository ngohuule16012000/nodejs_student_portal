
module.exports = {
    mutipleMongooseToObject: function (mongooses) {
        return mongooses.map(mongooses => mongooses.toObject());
    },

    mongooseToObject: function (mongoose) { // 1 doc
        return mongoose ? mongoose.toObject() : mongoose;
    },
};