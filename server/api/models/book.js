/*const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
        Title: { type: String, required: true },
        ISBN: { type: String, required: true },
        BibNum: { type: String },
       // pageCount: { type: String },
       // publishedDate: { type: String, required: true },
        //longDescription: { type: String, required: true },
        //shortDescription: { type: String, required: true },
        //status: { type: String, required: true },
        Author: { type: String },
        Genre: { type: String },
        ItemCount: { type: String },
        Publisher: { type: String },
        Volume: { type: String }
    },
    { timestamps: true }
);

bookSchema.index({ Title: 'text', 'Author': 'text', 'Category': 'text' });
module.exports = mongoose.model("book", bookSchema);
*/

const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {

        Title: { type: String, required: true },
        ISBN: { type: String, required: true },
        BibNum: { type: String },
        Author: { type: String },
        Genre: { type: String },
        ItemCount: { type: String },
        Publisher: { type: String },
        Volume: { type: String }
    },
    { timestamps: true }
);

bookSchema.index({ Title: "text" });
module.exports = mongoose.model("book", bookSchema);


