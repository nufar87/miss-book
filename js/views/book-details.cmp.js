import { bookService } from '../services/book-service.js';
import { eventBus } from '../services/event-bus.service.js';

import longText from '../cmps/long-text.cmp.js';
import addReview from '../cmps/add-review.cmp.js';
import bookReview from '../cmps/book-review.cmp.js';

export default {
  name: 'book-details',
  template: `
         <section v-if="book" class="main-layout" >
            <div class="books-nav">
              <router-link v-if="prevBookId" :to="'/book/' + prevBookId">Previous book</router-link>
                <router-link v-if="nextBookId" :to="'/book/' + nextBookId">Next book</router-link>
            </div>
            <section class="flex book-details justify-center align-center">
           
                <div class="img-container flex justify-center align-center">
                    <img class="book-img" v-bind:src="book.thumbnail" />
                </div>
                <div class="book-info flex column">
                  <h1 class="book-title">{{book.title}}</h1>
                  <h3 class="book-subtitle">{{book.subtitle}}</h3>
                  <h6>by {{getAuthors}}</h6>
                  <div :class="getPriceColor">{{formattedPrice}}</div>
            <ul class="clean-list unique-list">
              <li v-for="data in uniqueData">
                <img class="icons" src="img/v-icon.png" alt="">
                {{data}}</li>
            </ul>
                  <long-text :txt="book.description" :maxLength="100"/>
                  <span>REVIEWS</span>
                  <ul v-if="book.reviews && book.reviews.length" class="clean-list">
              <li v-for="review in getReviews">
                <book-review :review="review" @remove-review="remove"></book-review>
              </li>
            </ul>
            <div v-else>no reviews yet</div>
            <button @click="toggleEditReview">Add Review</button>
            <add-review v-if="editReview" @new-review="addReview" @close="toggleEditReview"></add-review>
                <button @click="close" @keyup.esc="close">close</button>
            </section>
        </section>
    `,
  data() {
    return {
      book: null,
      editReview: false,
      uniqueData: [],
      nextBookId: null,
      prevBookId: null,
    };
  },
  created() {
    const { id } = this.$route.params;
    this.loadBook(id);
  },
  computed: {
    getAuthors() {
      return this.book.authors.join(', ');
    },
    getPriceColor() {
      var price = this.book.listPrice.amount;
      if (price > 150) return 'red';
      else if (price < 20) return 'green';
      return '';
    },
    formattedPrice() {
      var listPrice = this.book.listPrice;
      return bookService.formattedPrice(
        this.book.language,
        listPrice.currencyCode,
        listPrice.amount
      );
    },
    getReviews() {
      return this.book.reviews;
    },
    showReading() {
      const pageAmount = this.book.pageCount;
      if (pageAmount > 500) return '- Decent Reading';
      else if (pageAmount > 200) return '- Long reading';
      else return '- Light Reading';
    },

    reviewsWithDate() {
      return this.book.reviews.map((review) => {
        review.date = this.localTime(review.date);
        return review;
      });
    },

    isCheap() {
      return this.book.listPrice.amount < 20;
    },

    isExpensive() {
      return this.book.listPrice.amount > 150;
    },

    showCurrency() {
      const currency = this.book.listPrice.currencyCode;
      if (currency === 'EUR')
        return (this.price = this.book.listPrice.amount + '€');
      else if (currency === 'ILS')
        return (this.price = '₪' + this.book.listPrice.amount);
      else return (this.price = '$' + this.book.listPrice.amount);
    },

    showNewOrOld() {
      const publishedYear = this.book.publishedDate;
      let now = new Date();
      now = now.getFullYear();
      if (now - publishedYear > 10) return '- Veteran Book';
      if (now - publishedYear < 1) return '- New!';
    },
    bookId() {
      return this.$route.params.id;
    },
  },

  methods: {
    close() {
      this.$router.push('/book');
    },
    remove(reviewId) {
      console.log('removed', reviewId);

      bookService
        .removeReview(this.book.id, reviewId)
        .then((book) => {
          this.book = book;
        })
        .catch((error) => {
          console.log('error', error);
        });
    },
    addReview(newReview) {
      bookService
        .addReview(this.book.id, newReview)
        .then((book) => {
          this.book = book;
          this.toggleEditReview();
        })
        .catch((error) => {
          console.log('error', error);
        });
    },
    toggleEditReview() {
      this.editReview = !this.editReview;
    },
    setPageCountData() {
      var pageCount = this.book.pageCount;
      if (pageCount > 500) this.uniqueData.push('Long reading');
      else if (pageCount > 200) this.uniqueData.push('Decent Reading');
      else if (pageCount < 100) this.uniqueData.push('Light Reading');
    },
    setPublishedDateData() {
      var publishedYear = this.book.publishedDate;
      var currYear = new Date(Date.now()).getFullYear();
      var yearDiff = +currYear - publishedYear;
      if (yearDiff > 10) this.uniqueData.push('Veteran Book');
      else if (yearDiff < 1) this.uniqueData.push('New Book');
    },
    localTime(date) {
      return new Date(date).toLocaleDateString('en-US');
    },
    loadBook(bookId) {
      bookService.getBookById(bookId).then((book) => {
        this.book = book;
        this.uniqueData = [];
        if (this.book.listPrice.isOnSale) this.uniqueData.push('ON SALE!');
        this.setPageCountData();
        this.setPublishedDateData();
        bookService.createReviews(book);
        this.book = book;
        bookService.getNextBook(this.book.id).then((nextBookId) => {
          this.nextBookId = nextBookId;
        });
        bookService.getPrevBook(this.book.id).then((prevBookId) => {
          this.prevBookId = prevBookId;
        });
      });
    },
  },

  watch: {
    bookId() {
      this.loadBook(this.bookId);
    },
  },
  components: {
    longText,
    addReview,
    bookReview,
  },
};
