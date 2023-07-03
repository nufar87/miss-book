export default {
  props: ['book'],
  template: `
        <section class="book-preview">
          <router-link :to="'/book/' + book.id">
            <img v-bind:src="book.thumbnail" />
            <h2>{{ book.title }}</h2>
            <p :book="showCurrency">{{book.listPrice.amount}} {{this.currency}}</p>
            </router-link>
        </section>
    `,
  data() {
    return {
      currency: null,
    };
  },
  computed: {
    showCurrency() {
      var currency = this.book.listPrice.currencyCode;
      switch (currency) {
        case 'EUR':
          return (this.currency = '€');
        case 'ILS':
          return (this.currency = '₪');
        case 'USD':
          return (this.currency = '$');
      }
    },
  },
};
