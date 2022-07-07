"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookRoutes = (0, express_1.Router)();
const book_model_1 = require("../schemas/book.model");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
bookRoutes.get('/create', (req, res) => {
    res.render("createBook");
});
bookRoutes.post('/create', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.body);
        const authorNew = new book_model_1.Author({ name: req.body.author });
        const categoryNew = new book_model_1.Category({ name: req.body.category });
        yield authorNew.save();
        yield categoryNew.save();
        const bookNew = new book_model_1.Book({ title: req.body.title,
            description: req.body.description,
            author: authorNew._id,
            categories: categoryNew._id });
        bookNew.keywords.push({ keyword: req.body.keyword });
        const book = yield bookNew.save();
        if (book) {
            res.render("success");
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
}));
bookRoutes.post('/update', upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findOne({ _id: req.body.id });
        book.title = req.body.title;
        book.description = req.body.description;
        book.author = req.body.author;
        yield book.save();
        if (book) {
            res.render("success");
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
}));
bookRoutes.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        console.log(req.query);
        if (req.query.keyword && req.query.keyword !== "") {
            let keywordFind = req.query.keyword || "";
            query = { "keywords.keyword": { $regex: keywordFind } };
        }
        if (req.query.author && req.query.author !== "") {
            let authordFind = req.query.author || "";
            let author = yield book_model_1.Author.find({ name: { $regex: authordFind }, });
            query = Object.assign(Object.assign({}, query), { author: author });
        }
        if (req.query.category) {
            let categoriesFind = req.query.category || "";
            let author = yield book_model_1.Author.find({ categories: categoriesFind });
            query = Object.assign(Object.assign({}, query), { author: author });
        }
        // category: req.query.category
        const books = yield book_model_1.Book.find(query)
            .populate([{ path: "author", select: "name" }, { path: "categories", select: "name" }]);
        const listOfCategory = yield book_model_1.Category.find();
        res.render("listBook", { books: books, listOfCategory: listOfCategory });
    }
    catch (_a) {
        res.render("error");
    }
}));
bookRoutes.get('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findOne({ _id: req.params.id });
        console.log(book, 'book');
        if (book) {
            res.render("updateBook", { book: book });
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
}));
bookRoutes.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findOne({ _id: req.params.id });
        if (book) {
            yield book.remove();
            res.status(200).json({ message: "success" });
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
}));
exports.default = bookRoutes;
