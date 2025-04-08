const bookSchema = require("../models/books");
const userSchema = require("../models/user");

exports.addBook = async (req, res) => {
    try {
        const BibNum = req.body.BibNum;
        const Title = req.body.Title;
        const ItemCount = req.body.ItemCount;
        // const password = req.body.password
        const Author = req.body.Author;
        const ISBN = req.body.ISBN;
        const Publisher = req.body.Publisher;
        const Genre = req.body.Genre;

        let doc = await bookSchema.findOne({ ISBN: ISBN })
        if (!doc) {
            const book = new bookSchema({
                BibNum: BibNum,
                Title: Title,
                ItemCount: ItemCount,
                Author: Author,
                ISBN: ISBN,
                Publisher: Publisher,
                Genre: Genre
            });
            await book.save();
            return res.status(200).json({ msg: "Book Added SuccessFully" });

        } else if (doc) {
            return res.status(400).json({ msg: " Book Already Exist" });
        }
    }
    catch (error) {
        throw error;
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await bookSchema.find();
        return res.status(200).json({ books });
    } catch (error) {
        throw error;
    }
};


exports.searchBooks = async (req, res) => {
    try {
        const searchText = req.params.id;
        if (searchText === "-") {
            const books = await bookSchema.find();
            return res.status(200).json({ books });
        }

        const regex = new RegExp(searchText, 'i'); // case-insensitive regex

        const books = await bookSchema.find({
            $or: [
                { Title: { $regex: regex } },
                { Author: { $regex: regex } }, // Make sure this field exists in your schema
                { Genre: { $regex: regex } }   // Same here
            ]
        });

        res.status(200).json({ books });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



exports.addToCart = async (req, res) => {

    try {
        console.log("trying to add on cart")
        const { username } = req.body;
        const books = req.body.books;
        if (!books || !Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ msg: "Invalid books array" });
        }

        const user = await userSchema.findOne({ username });
        console.log("this is the user", user)
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }


        for (let i = 0; i < books.length; i++) {
            const ISBN = books[i];
            console.log("this is the index", i)
            console.log(ISBN)
            const book = await bookSchema.findOne({ ISBN });
            console.log("this is the book", book)
            if (!book) {
                return res.status(400).json({ msg: `Book with ISBN ${ISBN} not found` });
            }
            console.log(book)
            if (book.ItemCount > 0) {
                // Decrease item count of the book
                book.ItemCount -= 1;
                await book.save();

                // Add ISBN to user's cart
                // user.cart.push(ISBN);
                user.cart.push({
                    isbn: book.ISBN
                });
            } else {
                return res.status(400).json({ msg: `Book with ISBN ${ISBN} is out of stock` });
            }
        }

        await user.save();

        return res.status(200).json({ msg: "Books added to cart successfully" });
    } catch (error) {
        throw error;
    }
};



exports.checkout = async (req, res) => {
    try {
        const { username, isbn } = req.body;

        if (!username || !isbn) {
            return res.status(400).json({ msg: "Username and ISBN are required" });
        }

        const user = await userSchema.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const bookIndex = user.cart.findIndex(item => item.isbn === isbn);
        if (bookIndex === -1) {
            return res.status(400).json({ msg: "Book not found in user's cart" });
        }

        const book = await bookSchema.findOne({ ISBN: isbn });
        if (!book) {
            return res.status(404).json({ msg: "Book not found in inventory" });
        }

        if (book.ItemCount <= 0) {
            return res.status(400).json({ msg: "Book is out of stock" });
        }

        // Update inventory
        //book.ItemCount -= 1;
        //await book.save();

        // Add to borrowed list
        user.borrowed.push({ isbn, takenDate: new Date(), status: "borrowed" });

        // Remove from cart
        user.cart.splice(bookIndex, 1);

        await user.save();

        return res.status(200).json({ msg: `Book with ISBN ${isbn} checked out successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

exports.returnStatusBook = async (req, res) => {
    try {
        const { uniqueId, isbn } = req.body;

        if (!uniqueId || !isbn) {
            return res.status(400).json({ msg: "Unique ID and ISBN are required" });
        }

        const user = await userSchema.findOne({ uniqueId });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const borrowedEntry = user.borrowed.find(
            entry => entry.isbn === isbn && entry.status === "borrowed"
        );

        if (!borrowedEntry) {
            return res.status(404).json({ msg: "Borrowed book not found or already returning/returned" });
        }

        // ✅ Update the status
        borrowedEntry.status = "returning";
        user.markModified("borrowed");

        await user.save();

        return res.status(200).json({ msg: `Status updated to 'returning' for ISBN ${isbn}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

exports.returnBooks = async (req, res) => {
    try {
        const { uniqueId, isbn } = req.body;

        const user = await userSchema.findOne({ uniqueId });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const books = await bookSchema.find({ ISBN: { $in: isbn } });
        if (books.length === 0) {
            return res.status(404).json({ msg: 'No books found with the provided ISBN' });
        }

        for (const singleIsbn of isbn) {
            const index = user.borrowed.findIndex(book => book.isbn === singleIsbn);

            if (index !== -1) {
                // Remove only the first match
                user.borrowed.splice(index, 1);

                // Update book count
                const book = await bookSchema.findOne({ ISBN: singleIsbn });
                if (book) {
                    book.ItemCount += 1;
                    await book.save();
                }
            }
        }

        await user.save();
        return res.status(200).json({ msg: 'Books returned successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};


exports.removeFromCart = async (req, res) => {
    try {
        const { username, isbn } = req.body;

        // Find the user
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if the book exists in the cart before removing
        const bookInCart = user.cart.find((book) => book.isbn === isbn);
        if (!bookInCart) {
            return res.status(400).json({ msg: 'Book not found in cart' });
        }

        // Remove the book from the user's cart
        user.cart = user.cart.filter((book) => book.isbn !== isbn);

        // Increase ItemCount by 1 in the bookSchema
        const book = await bookSchema.findOne({ ISBN: isbn });
        if (book) {
            book.ItemCount += 1;
            await book.save();
        }

        // Save the updated user
        await user.save();

        return res.status(200).json({ msg: 'Book removed from cart successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};



exports.filter = async (req, res) => {
    try {
        const genre = req.params.genre;
        const year = req.params.year;
        const title = req.params.title;

        const query = {};

        // Apply genre filter
        if (genre !== 'all') {
            query.genre = genre;
        }

        // Apply year filter
        if (year !== 'all') {
            query.year = year;
        }

        // Apply title filter
        if (title !== 'all') {
            query.title = { $regex: title, $options: 'i' };
        }

        // Find books based on the filter criteria
        const books = await bookSchema.find(query);

        return res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.booksInCart = async (req, res) => {
    try {
        const username = req.params.username;

        // Find the user
        const user = await userSchema.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(200).json({ books: [] });
        }

        // Map over each cart entry and fetch the book
        const books = await Promise.all(
            user.cart.map(async (item) => {
                const book = await bookSchema.findOne({ ISBN: item.isbn });
                return book; // will keep duplicates
            })
        );

        return res.status(200).json({ books });
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

exports.allBooksInCart = async (req, res) => {
    try {
        const users = await userSchema.find();

        const allCartBooks = [];

        for (const user of users) {
            if (user.cart && user.cart.length > 0) {
                for (const cartItem of user.cart) {
                    const book = await bookSchema.findOne({ ISBN: cartItem.isbn });

                    if (book) {
                        allCartBooks.push({
                            ...book._doc,
                            username: user.username,
                            userId: user._id,
                        });
                    }
                }
            }
        }

        return res.status(200).json({ books: allCartBooks });
    } catch (error) {
        console.error("Error fetching all cart books:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};



exports.borrowedBooks = async (req, res) => {
    try {
        const users = await userSchema.find({ borrowed: { $exists: true, $ne: [] } });

        if (users.length === 0) {
            return res.status(404).json({ msg: "No borrowed books found" });
        }

        const borrowedBooks = [];

        for (const user of users) {
            for (const book of user.borrowed) {
                const borrowedBook = {
                    isbn: book.isbn,
                    title: "",
                    author: "",
                    uid: user.uniqueId,
                    borrower: user.name,
                    takenDate: book.takenDate,
                    status: book.status
                };

                const bookDetails = await bookSchema.findOne({ ISBN: book.isbn });
                console.log(bookDetails);
                if (bookDetails) {
                    borrowedBook.title = bookDetails.Title;
                    borrowedBook.author = bookDetails.Author;
                } else {
                    borrowedBook.title = "Unknown";
                    borrowedBook.author = "Unknown";
                }

                borrowedBooks.push(borrowedBook);
            }
        }

        return res.status(200).json(borrowedBooks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}