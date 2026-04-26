"use strict";

class Book {
    static _count = 0;

    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.id = ++Book._count;
        this.createdAt = Date.now();
    }

    static get Count() {
        return Book._count;
    }

    fullInfo() {
        return `${this.title} — ${this.author}`;
    }
}

class BookStore {
    constructor() {
        this.books = [];
    }

    add(book) {
        this.books.push(book);
    }

    list() {
        return this.books;//массив книг
    }

    size() {
        return this.books.length;//кол-во
    }

    exists(title, author) {
        return this.books.some(book => 
            book.title.toLowerCase() === title.toLowerCase() && 
            book.author.toLowerCase() === author.toLowerCase()
        );
    }
}

class BookApp {
    constructor(store) {
        this.store = store;
        this.titleEl = this.must("#title");
        this.authorEl = this.must("#author");
        this.addBtnEl = this.must("#addBtn");
        this.counterEl = this.must("#counter");
        this.cardsEl = this.must("#cards");
        this.errorEl = this.must("#error");

        this.addBtnEl.addEventListener("click", () => this.onAdd());
        
        this.render();
    }

    must(selector) {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`Элемент не найден: ${selector}`);
        return el;
    }

    normalize(s) {
        return s.trim().replace(/\s+/g, " ");
    }

    setError(msg) {
        this.errorEl.textContent = msg;
    }

    onAdd() {
        const title = this.normalize(this.titleEl.value);
        const author = this.normalize(this.authorEl.value);

        if (!title || !author) {
            return this.setError("Название и автор не могут быть пустыми");
        }

        if (this.store.exists(title, author)) {
            return this.setError("Такая книга уже есть в списке");
        }

        this.setError("");
        this.store.add(new Book(title, author));
        
        this.titleEl.value = "";
        this.authorEl.value = "";
        this.titleEl.focus();
        
        this.render();
    }

    render() {
        this.counterEl.textContent = String(this.store.size());
        this.cardsEl.innerHTML = "";

        if (this.store.size() === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.className = "empty";
            this.cardsEl.append(emptyMsg);
            return;
        }

        for (const book of this.store.list()) {
            const card = document.createElement("div");
            const titleDiv = document.createElement("div");
            const authorDiv = document.createElement("div");
            const idDiv = document.createElement("div");

            card.className = "card";
            titleDiv.className = "title";
            authorDiv.className = "author";
            idDiv.className = "id";

            titleDiv.textContent = `Книга: ${book.title}`;
            authorDiv.textContent = `Автор: ${book.author}`;
            idDiv.textContent = `ID: ${book.id}`;

            card.append(titleDiv, authorDiv, idDiv);
            this.cardsEl.append(card);
        }
    }
}

new BookApp(new BookStore());