<template>
 <v-container>
   <v-flex>
     <v-card>
       <v-toolbar color="light-blue" dark>
         <v-toolbar-side-icon><v-icon>star</v-icon></v-toolbar-side-icon>
         <v-toolbar-title>Favorites</v-toolbar-title>
       </v-toolbar>
       <v-list-tile-content>
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
</template>

<script>
export default {
props: {
 favorites: {
  default: function() {
   return {
    favorites: this.favorites
   }
  }
 }
},
methods: {
  removeFromFavorites(index) {
   this.$emit('removeFavorite', index)
  }
 }
}
</script>

<style>

</style>
