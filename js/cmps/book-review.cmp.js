import longText from '../cmps/long-text.cmp.js';

export default {
  props: ['review'],
  template: `
        <section class="flex">
            <div class="img-container">
                <img class="user-img" src="img/user.png" alt="">
            </div>
            <div class="review-info">
                <div class="writer-name">{{review.name}}</div>
                <span>{{'⭐'.repeat(review.rating)}}</span>
                <span class="read-at"> {{review.readAt}}</span>
                <long-text :txt="review.textarea" :maxLength="30"></long-text>
                <button @click="deleteR">X</button>
            </div>
        </section>
    `,
  methods: {
    deleteR() {
      console.log('delete');
      this.$emit('remove-review', { ...this.review.id });
    },
  },
  computed: {
    getImgSrc(num) {
      console.log(num);
      return '.././imgs/user_icon_' + num + '.png';
    },
  },
  components: {
    longText,
  },
};
