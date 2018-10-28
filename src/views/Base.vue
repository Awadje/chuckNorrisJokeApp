<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>Chuck Norris Joke Generator App</v-toolbar-title>
    </v-toolbar>
    <v-alert v-show="alert" outline color="error" icon="warning" :value="true" dismissible v-model="alert">
      {{ error }}
    </v-alert>
    <v-responsive>
      <v-container>
        <v-flex>
          <v-card>
            <v-toolbar color="light-blue" dark>
                <v-toolbar-side-icon><v-icon>sentiment_very_satisfied</v-icon></v-toolbar-side-icon>
                <v-toolbar-title>Random Jokes</v-toolbar-title>
            </v-toolbar>
            <v-list-tile-content>
              <v-list-tile
                v-for="joke in jokes.value"
                :key="joke.id"
                avatar
                >
                <v-list-tile-avatar>
                  <v-icon v-if="!matchingJoke(joke)" @click="addToFavorites(joke)">star_outline</v-icon>
                  <v-icon color="yellow" v-if="matchingJoke(joke)" @click="addToFavorites(joke)">star</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>{{ joke.joke }}</v-list-tile-title>
              </v-list-tile>
            </v-list-tile-content>
            <v-btn dark color="green" @click="getJokes">Get Random Jokes</v-btn>
          </v-card>
        </v-flex>
      </v-container>

      <v-container>
        <v-flex>
          <v-card>
            <v-toolbar color="light-blue" dark>
              <v-toolbar-side-icon><v-icon>star</v-icon></v-toolbar-side-icon>
              <v-toolbar-title>Favorites</v-toolbar-title>
            </v-toolbar>
            <v-list-tile-content>
              <v-btn v-if="!timerOn" dark color="green" @click="jokeTimer">Random Joke Timer</v-btn>
              <v-btn v-if="timerOn" @click="stopJokeTimer" color="error">Stop Random Joke Timer</v-btn>
              <v-list-tile
                v-for="(favorite, index) in favorites"
                :key="favorite.id"
                avatar
                >
                <v-list-tile-avatar>
                  <v-icon color="error" @click="removeFromFavorites(index)">cancel</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-title>{{ favorite.joke }}</v-list-tile-title>
              </v-list-tile>
            </v-list-tile-content>
          </v-card>
        </v-flex>
      </v-container>
    </v-responsive>
  </v-app>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        error: false,
        alert: false,
        jokes: [],
        favorites: [],
        timerOn: false,
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
        axios.get(`http://api.icndb.com/jokes/random/1`)
        .then(response => {
          if(this.favorites.length < 10) {
            this.favorites.push(response.data.value[0])
          } else {
            this.stopJokeTimer()
            this.alert = true
            this.error = "Maximum Favorites reached"
          }
        })
        .catch(e => {
          this.alert = true
          this.error = e
        })
      },
      matchingJoke(joke) {
        return this.favorites.map(i => i.id).includes(joke.id)
      },
      addToFavorites(joke) {
        if(this.matchingJoke(joke)){
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
      jokeTimer() {
        this.timerOn = true
        this.jokeInterval = setInterval(() => this.getJokesRandom(), 5000)
      },
      stopJokeTimer() {
        this.timerOn = false
        clearInterval(this.jokeInterval)
      }
    }
  }
</script>