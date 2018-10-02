const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: [ true, 'the name is required']},
    description: { type: String, required: [ true, 'the description is required']},
    status: { type: Boolean, default: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model( 'Category', categorySchema );