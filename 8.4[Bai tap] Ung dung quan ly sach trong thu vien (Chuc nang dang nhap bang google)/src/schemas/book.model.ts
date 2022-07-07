import {Schema, model} from "mongoose";

interface IBook {
    title: string;
    description: string;
    author: string;
    keywords: object[];
    categories : object[];
}


interface IAuthor {
    name: string
}

interface ICategory {
    category: string
}


const keywordsSchema = new Schema({
    keyword: String
})
const categorySchema = new Schema({
    name: String
})

const authorSchema = new Schema<IAuthor>({
    name: String
})


const bookSchema = new Schema<IBook>({
    title: String,
    description: String,
    author: { type:Schema.Types.ObjectId, ref: "Author" },
    keywords: [keywordsSchema],
    categories: { type:Schema.Types.ObjectId, ref: "Category" },
})

const Author = model<IAuthor>('Author', authorSchema);
const Category = model<ICategory>('Category', categorySchema);
const Book = model<IBook>('NewBook', bookSchema);
export { Book , Author, Category};