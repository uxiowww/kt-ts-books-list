class Book {
    static count = 0;
    id: number;
    createdAt: number;

    constructor(public title: string, public author: string) {
        this.id = ++Book.count;
        this.createdAt = Date.now();
    }


}

class BookStorage {
    private books: Book[] = [];

    add(book: Book): void {
        this.books.push(book);
    }

    getAll(): Book[] {
        return this.books;
    }

    getCount(): number {
        return this.books.length;
    }

    hasDuplicate(title: string, author: string): boolean {
        return this.books.some(book => 
            book.title.toLowerCase() === title.toLowerCase() &&
            book.author.toLowerCase() === author.toLowerCase()
        );
    }
}

class BookApp {
    private titleInput: HTMLInputElement;
    private authorInput: HTMLInputElement;
    private addBtn: HTMLButtonElement;
    private counterSpan: HTMLSpanElement;
    private cardsDiv: HTMLDivElement;
    private errorDiv: HTMLDivElement;

    constructor(private storage: BookStorage) {
        this.titleInput = document.querySelector('#title')!;
        this.authorInput = document.querySelector('#author')!;
        this.addBtn = document.querySelector('#addBtn')!;
        this.counterSpan = document.querySelector('#counter')!;
        this.cardsDiv = document.querySelector('#cards')!;
        this.errorDiv = document.querySelector('#error')!;

        this.addBtn.onclick = () => this.addBook();
        this.render();
    }

    private clean(str: string): string {
        return str.trim().replace(/\s+/g, ' ');
    }

    private showError(msg: string): void {
        this.errorDiv.textContent = msg;
    }

    private addBook(): void {
        const title = this.clean(this.titleInput.value);
        const author = this.clean(this.authorInput.value);

        if (!title || !author) {
            this.showError("Заполните два поля");
            return;
        }

        if (this.storage.hasDuplicate(title, author)) {
            this.showError("Такая книга уже есть");
            return;
        }

        this.storage.add(new Book(title, author));
        
        this.titleInput.value = '';
        this.authorInput.value = '';
        this.showError('');
        
        this.render();
    }

    private render(): void {
        this.counterSpan.textContent = String(this.storage.getCount());

        this.cardsDiv.innerHTML = '';
        
        for (let book of this.storage.getAll()) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="title">Книга: ${book.title}</div>
                <div class="author">Автор: ${book.author}</div>
                <div class="id">ID: ${book.id}</div>
            `;
            this.cardsDiv.appendChild(card);
        }
    }
}

new BookApp(new BookStorage());
