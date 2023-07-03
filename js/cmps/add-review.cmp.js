import { bookService } from '../services/book-service.js';

export default {
  template: `
        <section class="review-modal flex column justify-center align-center">
            <form v-on:submit.prevent="submit" class="flex column align-center">
                <label htmlFor="nameInput">user name:</label>
                <input type="text" v-model="review.name" ref="nameInput">
                <label htmlFor="rating">star rate:</label>
                <input type="number" min="1" max="5" v-model="review.rating">
                <input type="date" v-model="review.readAt" required>
                <label htmlFor="rating">type your review:</label>
                <textarea name="" id="" cols="30" rows="10" v-model="review.textarea"></textarea>
                <button>save</button>
            </form>
            <button @click="close">cancel</button>
        </section>
    `,
  created() {
    this.review.id = bookService.makeId();
    this.review.idImg = bookService.makeId2();
  },
  data() {
    return {
      review: {
        id: null,
        idImg: null,
        name: 'Books Reader',
        rating: 1,
        readAt: new Date().toISOString().slice(0, 10),
        textarea: '',
      },
    };
  },
  mounted() {
    this.$refs.nameInput.focus();
  },
  methods: {
    submit() {
      this.$emit('new-review', { ...this.review });
    },
    close() {
      this.$emit('close');
    },
  },
};
