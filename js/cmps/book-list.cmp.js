import bookPreview from './book-preview.cmp.js';

export default {
  props: ['books'],
  template: `
        <section class="book-list">
            <ul>
                <li v-for="book in books" :key="book.id" class="clean-list align-center text-center">
                <router-link :to="'/book/' + book.id">
                <book-preview :book="book" />
                    </router-link>
                    <section class="actions">
                        <button @click.stop="remove(book.id)">x</button>
                    </section>
                </li>
            </ul>
        </section>
    `,
  methods: {
    remove(bookId) {
      this.$emit('remove', bookId);
    },
    showDetails(book) {
      this.$emit('selected', book);
    },
  },
  components: {
    bookPreview,
  },
};
