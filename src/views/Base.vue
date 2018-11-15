<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>Chuck Norris Joke Generator App</v-toolbar-title>
    </v-toolbar>
    <v-alert v-show="alert" outline color="error" icon="warning" :value="true" dismissible v-model="alert">
      {{ error }}
    </v-alert>
    <v-responsive>
      <v-btn dark color="green" @click="getJokes">Get Random Jokes</v-btn>
      <v-btn v-if="jokeInterval === null" dark color="green" @click="getJokesRandom">Random Joke Timer</v-btn>
      <v-btn v-if="jokeInterval !== null" @click="stopJokeTimer" color="error">Stop Random Joke Timer</v-btn>

      <app-random-jokes
        :jokes="jokes"
        :favorites="favorites"
        @addFavorite="addToFavorites($event)"
        >
      </app-random-jokes>

       <app-favorite-jokes
        :favorites="favorites"
        @removeFavorite="removeFromFavorites($event)"
        >
      </app-favorite-jokes>
    </v-responsive>
  </v-app>
</template>

<script>
import randomJokes from './randomJokes'
import favoriteJokes from './favoriteJokes'
import axios from 'axios'

  export default {
    components: {
      AppRandomJokes: randomJokes,
      AppFavoriteJokes: favoriteJokes  
    },
    data () {
      return {
        error: false,
        alert: false,
        jokes: [],
        favorites: [],
        jokeInterval: null
      }
    },
    watch: {
      favorites: {
        handler() {
          localStorage.setItem('favorites', JSON.stringify(this.favorites));
        },
      deep: true,
      }
    },
    mounted() {
      if (localStorage.getItem('favorites')) 
      this.favorites = JSON.parse(localStorage.getItem('favorites'))
      this.getJokes()
    },
    methods: {
      getJokes() {
        axios.get(`http://api.icndb.com/jokes/random/11`)
        .then(response => {
          this.jokes = response.data
        })
        .catch(e => {
          this.alert = true
          this.error = e
        })
      },
      getJokesRandom() {
        if(this.favorites.length < 10) {
          axios.get(`http://api.icndb.com/jokes/random/1`)
          .then(response => {
            this.jokeInterval = setInterval(() => {
              if (this.favorites.length > 10) {
                clearInterval(this.jokeInterval)
              } else {
                this.addToFavorites(response.data.value[0])
              }}, 5000)
          })
          .catch(e => {
            clearInterval(this.jokeInterval)
            this.jokeInterval = null
            this.alert = true
            this.error = e
          })
        } else {
          this.alert = true
          this.jokeInterval = null
          this.error = "Maximum Favorites reached"
        }
      },
      addToFavorites(joke) {
        if(this.favorites.map(i => i.id).includes(joke.id)){
          clearInterval(this.jokeInterval)
          this.jokeInterval = null
          this.alert = true
          this.error = "This joke is already in your favorites"
        } else if (this.favorites.length < 10) {
          this.favorites.push(joke)
          this.alert = false
          this.error = ''
        } else {
          this.alert = true
          this.error = "Maximum Favorites reached"
        }
      },
      removeFromFavorites(index) {
        this.favorites.splice(index, 1)
      },
      stopJokeTimer() {
        clearInterval(this.jokeInterval)
        this.jokeInterval = null
      }
    }
  }
</script>