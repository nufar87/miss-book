import { bookService } from '../services/book-service.js';
import { eventBus } from '../services/event-bus.service.js';

import bookList from '../cmps/book-list.cmp.js';
import bookFilter from '../cmps/book-filter.cmp.js';

export default {
  template: `
    <section class="book-app">
        <book-add @add-book="reload"></book-add>
        <book-filter @filter="filter"/>
        <book-list v-if="books"
            :books="booksToShow"
            @selected="selectBook" 
            @remove="removeBook" />

    </section>

`,
  data() {
    return {
      books: [],
      filterBy: null,
    };
  },
  created() {
    bookService.query().then((books) => {
      this.books = books;
    });
  },

  methods: {
    removeBook(bookId) {
      bookService.remove(bookId).then(() => {
        const idx = this.books.findIndex((book) => book.id === bookId);
        this.books.splice(idx, 1);
        const msg = {
          txt: `Book ${bookId} deleted...`,
          type: 'success',
        };
        eventBus.emit('user-msg', msg);
      });
    },
    selectBook(book) {
      this.selectedBook = book;
    },
    bookSaved(book) {
      this.books.push(book);
    },
    filter(filterBy) {
      this.filterBy = filterBy;
    },
  },
  computed: {
    booksToShow() {
      if (!this.filterBy) return this.books;
      const { title, toPrice, fromPrice } = this.filterBy;
      const regex = new RegExp(this.filterBy.title, 'i');
      return this.books.filter(
        ({ title, listPrice: { amount } }) =>
          regex.test(title) && amount < toPrice && amount > fromPrice
      );
    },
  },
  components: {
    bookFilter,
    bookList,
  },
};
