"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = exports.Author = exports.Book = void 0;
const mongoose_1 = require("mongoose");
const keywordsSchema = new mongoose_1.Schema({
    keyword: String
});
const categorySchema = new mongoose_1.Schema({
    name: String
});
const authorSchema = new mongoose_1.Schema({
    name: String
});
const bookSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "Author" },
    keywords: [keywordsSchema],
    categories: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category" },
});
const Author = (0, mongoose_1.model)('Author', authorSchema);
exports.Author = Author;
const Category = (0, mongoose_1.model)('Category', categorySchema);
exports.Category = Category;
const Book = (0, mongoose_1.model)('NewBook', bookSchema);
exports.Book = Book;
