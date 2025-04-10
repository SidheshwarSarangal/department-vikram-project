
//Here Genre is Publication year 
// But in code and database it is given name Genre


const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {

        Title: { type: String, required: true },
        ISBN: { type: String, required: true },
        BibNum: { type: String },
        Author: { type: String },
        Genre: { type: String }, //It is publication year
        ItemCount: { type: String }, // It is set to 1
        Publisher: { type: String },
        Volume: { type: String }
    },
    { timestamps: true }
);

bookSchema.index({ Title: "text" });
module.exports = mongoose.model("book", bookSchema);


