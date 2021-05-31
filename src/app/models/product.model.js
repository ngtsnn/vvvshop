'use strict';

const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const slug = require("mongoose-slug-generator");
const { Schema } = mongoose;


//for slug generater
mongoose.plugin(slug, {
    separator: "-",
    lang: "en",
    truncate: 120
});


const property = new Schema({
    kind: { type: String, default: 'static', enum: ['static', 'customized'], required: true, },
    key: { type: String, default: '', required: true, },
    value: { type: Array, default: [], required: true, },
    fluctuatedAmount: { type: Number, default: 0 }, // can be negative number
});

const product = new Schema({
    name: { type: String, default: '', trim: true, required: true, },
    images: [{ type: String, default: '', }],
    properties: [property],
    categories: [{ type: mongoose.Types.ObjectId, ref: 'categorie', }],
    supplier: { type: mongoose.Types.ObjectId, ref: 'supplier', },
    description: { type: String, default: '', trim: true, required: true },
    orginalprice: { type: Number, required: true, min: 0 },
    slug: { type: String, slug: "name", unique: true },
}, {
    timestamps: true,
});


//for delete
product.plugin(mongoose_delete, {
    deleteAt: true,
    deleteBy: true,
    overrideMethods: true,
})

module.exports = mongoose.model("product", product); //collection: products