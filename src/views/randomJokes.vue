<template>
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
  </v-card>
 </v-flex>
</template>

<script>
export default {
props: {
 jokes: {
  default: function() {
   return {
    jokes: this.jokes
   }
  }
 },
 favorites: {
  default: function() {
   return {
    favorites: this.favorites
   }
  }
 }
},
methods: {
 matchingJoke(joke) {
  return this.favorites.map(i => i.id).includes(joke.id)
  },
 addToFavorites(joke) {
  this.$emit('addFavorites', joke)
 }
}
}
</script>

<style>

</style>
