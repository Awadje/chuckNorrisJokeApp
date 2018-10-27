<template>
  <v-app>
    <v-responsive height="100%">
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex xs12 sm8 md4>
            <v-card raised class="elevation-24">
              <v-alert icon="warning" :value="error" outline dismissible>{{error}}</v-alert>
              <div class="title-style text-md-center">Welcome</div>
              <div><img class="logo-style" src="../assets/CN.jpg"></div>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    v-model="email"
                    label="Gebruikersnaam"
                    type="email"
                    prepend-icon="person"
                    autofocus
                    required
                  />
                  <v-text-field
                    name="password"
                    label="Wachtwoord"
                    prepend-icon="lock"
                    :append-icon="isPasswordInvisible ? 'visibility_off' : 'visibility'"
                    @click:append="() => (isPasswordInvisible = !isPasswordInvisible)"
                    v-on:keyup.enter="login"
                    value=""
                    v-model="password"
                    :rules="passwordRules"
                    :type="isPasswordInvisible ? 'password' : 'text'"
                  />
                </v-form>
              </v-card-text>
                <v-card-actions>
                  <v-btn :disabled="!valid" v-if="!session" @click="signUp" class="loginbutton" color="primary">Sign Up & Login</v-btn>
                  <v-btn :disabled="!valid" v-if="session" @click="authenticate" class="loginbutton" color="primary">Login</v-btn>
                </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>
  </v-app>
</template>

<script>
import * as CryptoJS from 'crypto-js'

export default {
  name: 'Login',
  data () {
    return {
      error: false,
      valid: true,
      errors: '',
      user: '',
      email: '',
      password: '',
      isPasswordInvisible: true,
      session: '',
      passwordRules: [
        v => /^.*/.test(v) || 'Veld mag niet leeg zijn',
        v => /^((?![A-Z]).)*$/.test(v) || 'Alleen kleine letters',
        v => /^((?!i).)*$/.test(v) || 'Mag geen klene letter "i" bevatten',
        v => /^((?!l).)*$/.test(v) || 'Mag geen klene letter "l" bevatten',
        v => /^(?=.{1,32}$).*/.test(v) || 'Max 32 karakters',
        v => /(?=(.)\1+)/.test(v) || 'Moet een set van twee letters bevatten',
        // v => /^([a-z]){3}[a-z]*$/i.test(v) || 'Moet een set van 3 opvolgende letters bevatten',
      ]
    }
  },
  methods: {
    signUp() {
      localStorage.setItem('user', JSON.stringify({password: CryptoJS.AES.encrypt(JSON.stringify(this.password), process.env.VUE_APP_SECRET).toString(), email: this.email, active: true}))
      localStorage.setItem('auth', JSON.stringify({ authenticated: true }))
      this.$router.push({ path: 'base' })
    },
    checkSession() {
      if (this.user.active) {
        this.session = true
      } else {
        this.session = false
      }
    },
    decryptPassword() {
      var bytes  = CryptoJS.AES.decrypt(this.user.password, process.env.VUE_APP_SECRET);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData
    },
    getUser () {
       this.user = JSON.parse(localStorage.getItem('user'))
    },
    authenticate() {
      if(this.email === this.user.email && this.decryptPassword() === this.password) {
        localStorage.setItem('auth', JSON.stringify({ authenticated: true }))
        this.error = ''
        this.$router.push({ path: 'base' })
      } else {
        localStorage.setItem('auth', JSON.stringify({ authenticated: false }))
        this.error = 'Gebruikers naam en/of wachtwoord niet correct'
      }
    }
  },
  mounted () {
    if (localStorage.getItem('user')) 
    this.getUser()
    this.checkSession()
  }
}
</script>

<style scoped>
.title-style {
  color: #6A6A6A;
  font-weight: 200;
  font-size: 16px;
  margin: auto;
  padding-top: 87px;
  padding-bottom: 37px;
}
.loginbutton {
  float: right;
  max-width: 80%;
  font-weight: bold;
  margin-top: 38px;
  margin-bottom: 20px;
  margin-right: 15px;
}
.logo-style {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}
</style>
