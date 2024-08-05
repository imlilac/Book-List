class BaseBook {
   constructor(title) {
      this.title = title;
      this.isComplete = false;
   }

   toggleComplete() {
      this.isComplete = !this.isComplete;
   }

   toJSON() {
      return {
         title: this.title,
         isComplete: this.isComplete,
      };
   }
}

class Book extends BaseBook {
   constructor(title) {
      super(title);
   }
}

class AbstractBookList {
   constructor(booksContainer) {
      this.booksContainer = booksContainer;
      this.books = [];
      this.bookInput = document.querySelector("input");
      this.addBtn = document.querySelector("#addButton");
      this.clearBtn = document.querySelector("#clearButton");
   }

   render() {
      throw new Error('متد "render()" باید پیاده‌سازی شود.');
   }

   addBooksToDom() {
      throw new Error('متد "addBooksToDom()" باید پیاده‌سازی شود.');
   }

   saveBooksIntoLocalStorage() {
      localStorage.setItem("books", JSON.stringify(this.books.map((book) => book.toJSON())));
   }
}

class BookList extends AbstractBookList {
   constructor(booksContainer) {
      super(booksContainer);
      this.books = JSON.parse(localStorage.getItem("books")) || [];
      this.render();
   }

   render() {
      console.log("Book list has started");
      this.booksContainer.innerHTML = "";

      this.addBtn.addEventListener("click", () => {
         this.addNewBook(this.bookInput.value);
      });

      this.clearBtn.addEventListener("click", () => {
         this.clearBooks();
      });

      this.addBooksToDom();
      this.saveBooksIntoLocalStorage();
   }

   addBooksToDom() {
      console.log("Books added to DOM");

      this.booksContainer.innerHTML = "";

      this.books.forEach((book, bookIndex) => {
         let li = document.createElement("li");
         li.className = "completed well";
         li.style.direction = "rtl";
         li.style.listStyle = "none";
         li.style.display = "flex";
         li.style.justifyContent = "space-between";

         let buttonContainer = document.createElement("div");

         let bookTitleElem = document.createElement("label");
         bookTitleElem.innerHTML = book.title;
         book.isComplete ? bookTitleElem.classList.add("book-completed") : null;

         let completeBtn = document.createElement("button");
         completeBtn.className = "btn btn-success";
         completeBtn.innerHTML = "پایان یافته";

         completeBtn.addEventListener("click", (event) => {
            event.target.previousSibling.classList.toggle("book-completed");
            book.toggleComplete();
            this.saveBooksIntoLocalStorage();
            this.addBooksToDom();
         });

         let removeBtn = document.createElement("button");
         removeBtn.className = "btn btn-danger";
         removeBtn.innerHTML = "حذف";

         removeBtn.addEventListener("click", (event) => {
            this.booksContainer.removeChild(li);

            this.books.splice(bookIndex, 1);

            this.saveBooksIntoLocalStorage();
            this.addBooksToDom();
         });

         buttonContainer.append(completeBtn, removeBtn);
         li.append(bookTitleElem, buttonContainer);

         this.booksContainer.append(li);
      });
   }

   addNewBook(newBookTitle) {
      console.log("new book title:", newBookTitle);

      if (newBookTitle.trim()) {
         this.books.push(new Book(newBookTitle));
         this.saveBooksIntoLocalStorage();
         this.addBooksToDom();
         this.bookInput.value = "";
      }
   }

   clearBooks() {
      console.log("Books cleared");

      this.books = [];
      this.render();
      this.saveBooksIntoLocalStorage();
   }
}

new BookList(document.querySelector("#bookList"));
