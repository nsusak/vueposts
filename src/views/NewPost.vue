<template>
  <div class="">
    <h1>Add new post</h1>
    <div class="form">
      <div class="input input-title">
        <!-- <label for="post-title">Enter a post title</label> -->
        <input
          v-model="post.postTitle"
          type="email"
          id="post-title"
          placeholder="Enter a post title"
        />
      </div>
      <div class="input">
        <!-- <label for="post-body">Content</label> -->
        <textarea
          v-model="post.postBody"
          id="post-body"
          rows="25"
          placeholder="Enter your content"
        ></textarea>
      </div>
      <button class="addPost" @click="addPost">Add Post</button>
    </div>
  </div>
</template>




<script>
export default {
  name: "App",
  data() {
    return {
      post: {
        postBody: "",
        postTitle: "",
      },
    };
  },
  async created() {},
  methods: {
    async addPost() {
      const newData = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({
            title: this.post.postTitle,
            body: this.post.postBody,
            userId: 1,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
        .then((response) => response.json())
        .then((json) => json);
      this.$store.dispatch("addNewPost", newData);
      this.post = {};
      //redirects to home page, new post added to the end, filter by userID 1
      this.$router.push({ name: "Home" });
    },
  },
  computed: {
    newPost() {
      return this.$store.getters.newPost;
    },
  },
};
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 50px 300px;
  height: 50vh;
  border: 2px solid #e2e2e2;
  border-radius: 10px;
}

.input {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.input-title {
  height: 15%;
  margin-top: 50px;
}

#post-title::placeholder,
#post-body::placeholder {
  color: rgb(46, 42, 42);
  text-align: center;

  text-transform: capitalize;
}

#post-title {
  height: 70px;
  font-size: 20px;
}
#post-body {
  font-size: 15px;
}
.addPost {
  margin-top: 10px;
  padding: 1.1rem 3.2rem;
  padding-right: 2.5rem;
  font-size: 1.2rem;
  letter-spacing: 1.1rem;
  text-transform: uppercase;
  cursor: pointer;
}

#post-body,
#post-title {
  border: 2px solid #e2e2e2;
}
</style>
