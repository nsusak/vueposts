<template>
  <div>
    <h1 class="heading">Posts</h1>
    <div class="centerform">
      <div v-if="forEditing" class="editform">
        <div class="form">
          <div class="input input-title">
            <!-- <label for="post-title">Enter a post title</label> -->
            <input type="text" id="post-title" v-model="postToEdit.title" />
          </div>
          <div class="input">
            <!-- <label for="post-body">Content</label> -->
            <textarea
              id="post-body"
              rows="25"
              v-model="postToEdit.body"
            ></textarea>
          </div>
          <button @click="editPost(postToEdit)" class="addPost">
            Edit Post
          </button>
          <button class="addPost" style="padding: 3px" @click="exitForm">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <div class="container" v-if="filteredPosts">
      <div
        class="post"
        :class="currentCommentId === post.id ? 'focused' : ''"
        v-for="post of filteredPosts.slice(0, val)"
        :key="post.id"
      >
        <h3 class="post-title">{{ post.title }}</h3>

        <div class="posts-comments">
          <div class="filter-user" @click="filterByUser(post.userId)">
            See all posts by this <span>user:{{ post.userId }}</span>
          </div>
          <div class="filter-user" @click="seeComments(post.id)">
            See all comments
          </div>
        </div>

        <p class="post-content">{{ post.body }}</p>

        <div class="buttons">
          <button class="button-17" @click="openEditForm(post)">Edit</button>
          <button class="button-17 delete" @click="deletePost(post)">
            Delete
          </button>
        </div>

        <template v-if="comments.length">
          <template v-for="comment of comments">
            <div
              v-if="post.id === comment.postId"
              class="comments"
              :key="comment.id"
            >
              <div class="comment-by">Commented: {{ comment.email }}</div>
              <div class="comment-content">{{ comment.body }}</div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <template v-if="isFiltered">
      <div class="btn from-left" @click="goBack">Back to all posts!</div>
    </template>
    <div
      v-if="!isFiltered && val <= filteredPosts.length"
      class="btn from-left"
      @click="val += 12"
    >
      See more
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   isFiltered: false,
      val: 12,
      userIdFilter: null,
      forEditing: false,
      postToEdit: null,
      currentCommentId: null,
    };
  },
  async created() {
    if (!this.posts.length) {
      this.$store.dispatch("setAllPosts");
    }
  },
  methods: {
    filterByUser(id) {
      this.userIdFilter = id;
      // this.isFiltered = true;
    },
    async deletePost(post) {
      this.$store.dispatch("deletePost", post);
    },
    goBack() {
      this.userIdFilter = null;
      //this.isFiltered = false;
    },
    seeComments(id) {
      if (this.currentCommentId == null) {
        this.currentCommentId = id;
        this.$store.dispatch("getComments", id);
      } else if (id === this.currentCommentId) {
        this.$store.dispatch("deleteComments");
        this.currentCommentId = null;
      } else if (id !== this.currentCommentId) {
        this.currentCommentId = id;
        this.$store.dispatch("getComments", id);
      }
    },
    openEditForm(post) {
      this.forEditing = true;
      this.postToEdit = post;
    },
    editPost(post) {
      this.$store.dispatch("editPost", post);
      this.forEditing = false;
    },
    exitForm() {
      this.forEditing = false;
    },
  },
  computed: {
    posts() {
      return this.$store.getters.getAllPosts;
    },
    filteredPosts() {
      let output = [];
      if (this.userIdFilter == null) {
        return this.posts;
      } else {
        this.posts.forEach((post) => {
          if (post.userId === this.userIdFilter) {
            output.push(post);
          }
        });
        return output;
      }
    },
    comments() {
      return this.$store.getters.allComents;
    },
    isFiltered() {
      return this.userIdFilter != null;
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  max-width: 80vw;
  margin: auto;
}
.post {
  flex: 1;
  border-radius: 15px;
  padding: 10px;
  min-width: 25%;
  max-width: 25%;
  word-wrap: break-word;
}

.post-content {
  font-size: 13.5px;
  line-height: 23px;
  margin-top: 12px;
  text-align: justify;
  height: 90px;
  overflow: auto;
  padding-bottom: 5px;
  flex: auto;
}

.buttons {
  display: flex;
  flex-direction: column;
}

.post-title {
  text-transform: capitalize;
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 11px;
  letter-spacing: 0.8px;
  line-height: 23px;
  font-family: "Lora", serif;
  flex: auto;
  height: 40px;
}

span {
  color: #5eb4c2;
}

.btn {
  position: relative;
  padding: 1.4rem 4.2rem;
  padding-right: 3.1rem;
  font-size: 1.4rem;
  color: var(--inv);
  letter-spacing: 1.1rem;
  text-transform: uppercase;
  transition: all 500ms cubic-bezier(0.77, 0, 0.175, 1);
  cursor: pointer;
  user-select: none;
}

.btn:before,
.btn:after {
  content: "";
  position: absolute;
  transition: inherit;
  z-index: -1;
}

.btn:hover {
  color: var(--def);
  transition-delay: 0.2s;
}

.btn:hover:before {
  transition-delay: 0s;
}

.btn:hover:after {
  background: var(--inv);
  transition-delay: 0.2s;
}

.from-left:before,
.from-left:after {
  top: 0;
  width: 0;
  height: 100%;
}

.from-left:before {
  right: 0;
  border: 1px solid var(--inv);
  border-left: 0;
  border-right: 0;
}

.from-left:after {
  left: 0;
}

.from-left:hover:before,
.from-left:hover:after {
  width: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

body {
  --def: #fff;
  --inv: #aed2d8;
}

.heading {
  font-family: "Trebuchet MS", sans-serif;
  font-size: 5em;
  letter-spacing: -2px;
  border-bottom: 1px dotted rgb(51, 48, 48);
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 8px;
  border-bottom: 1px dotted #ddd;
}

.button-17 {
  align-items: center;
  appearance: none;
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
    rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 18px 0;
  box-sizing: border-box;
  color: #3c4043;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: 0.25px;
  line-height: normal;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 28%;
  will-change: transform, opacity;
  z-index: 0;
  margin: 3px;
}

.button-17:hover {
  background: #f6f9fe;
  color: #174ea6;
}

.button-17:active {
  box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%),
    0 8px 12px 6px rgb(60 64 67 / 15%);
  outline: none;
}

.button-17:focus {
  outline: none;
  border: 2px solid #4285f4;
}

.button-17:not(:disabled) {
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
    rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
}

.button-17:not(:disabled):hover {
  box-shadow: rgba(60, 64, 67, 0.3) 0 2px 3px 0,
    rgba(60, 64, 67, 0.15) 0 6px 10px 4px;
}

.button-17:not(:disabled):focus {
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
    rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
}

.button-17:not(:disabled):active {
  box-shadow: rgba(60, 64, 67, 0.3) 0 4px 4px 0,
    rgba(60, 64, 67, 0.15) 0 8px 12px 6px;
}

.button-17:disabled {
  box-shadow: rgba(60, 64, 67, 0.3) 0 1px 3px 0,
    rgba(60, 64, 67, 0.15) 0 4px 8px 3px;
}

.comments {
  background-color: white;
  margin-top: 40px;
  border-radius: 15px;
  width: 100%;
  box-shadow: rgba(67, 70, 73, 0.3) 0 0.5px 3px 0,
    rgba(93, 95, 97, 0.15) 0 4px 8px 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  height: auto;
  line-height: 20px;
  font-size: 14px;
  padding: 0 3px;
}

.comment-by {
  margin-top: 0;
  color: rgb(43, 42, 42);
  margin-bottom: 2px;
  font-size: 14px;
  padding: 1px;
}
.comment-content {
  border-top: 0.5px solid rgb(197, 197, 197);
  padding: 2px;
  text-align: justify;
  margin-bottom: 12px;
}

.filter-user {
  padding: 2px;
  font-size: 14px;
}

.filter-user span {
  color: rgb(66, 64, 64);
}

.filter-user:hover {
  cursor: pointer;
}

.posts-comments {
  border-top: 1px dotted #ddd;
  border-bottom: 1px dotted #ddd;
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
}

.editform {
  position: fixed;
  z-index: 1;
  background-color: white;
  border: 1px solid gray;
  width: 80%;
}
.centerform {
  display: flex;
  width: 100%;
  justify-content: center;
}
.exitform {
  background-color: #fff;
  border-radius: 24px;
  border-style: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
    rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 18px 0;
  box-sizing: border-box;
  color: #3c4043;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  justify-content: center;
  letter-spacing: 0.25px;
  line-height: normal;

  overflow: visible;
  padding: 15px 24px;
  position: relative;
  text-align: center;
  text-transform: none;

  z-index: 0;
  margin: 3px;
}
.focused {
  background-color: rgba(179, 163, 167, 0.219);
}
.delete {
  color: rgba(187, 11, 11, 0.486);
}
.delete:hover {
  background-color: rgba(187, 11, 11, 0.486);
  color: white;
}
</style>