<template>
<v-app>
<v-jumbotron class="login-jumbotron" height="100%">
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm8 md4>
        <v-card raised class="elevation-24">
          <div class="title-style text-md-center">Welcome</div>
          <!-- <div><img class="logo-style" src="../../assets/LogoColor.svg"></div> -->
          <v-card-text>
            <v-alert icon="warning" :value="error.status" outline dismissible>{{error.message}}</v-alert>
            <v-form>
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
                :type="isPasswordInvisible ? 'password' : 'text'">
              </v-text-field>
            </v-form>
          </v-card-text>
            <v-card-actions>
              <v-btn v-if="!session" @click="saveLoginData()" class="loginbutton" color="primary">Sign Up</v-btn>
              <v-btn v-if="session" @click="authenticate()" class="loginbutton" color="primary">Login</v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</v-jumbotron>
</v-app>
</template>

<script>
import * as CryptoJS from 'crypto-js'

export default {
  name: 'Login',
  data () {
    return {
      errors: '',
      user: '',
      email: '',
      password: '',
      isPasswordInvisible: true,
      session: '',
      error: {
        status: false,
        message: ''
      },
      passwordRules: [
        v => /^.*/.test(v) || 'Veld mag niet leeg zijn',
        v => /(?=.{12,})/.test(v) || 'Minimale lengte moet 12 zijn',
        v => /(?=.*[a-zA-Z])/.test(v) || 'Het wachtwoord moet zowel kleine letters als hoofdletters bevatten',
        v => /(?=.*\d)/.test(v) || 'Het wachtwoord moet nummers bevatten',
        v => /(?=.*[!#$%&? "])/.test(v) || 'Het wachtwoord moet speciale tekens bevatten',
        v => /.*$/.test(v) || ''
      ]
    }
  },
  watch: {
    user: {
      handler() {
        localStorage.getItem('user', JSON.stringify(this.user));
      },
    deep: true,
    }
  },
  computed: {
  },
  methods: {
    saveLoginData () {
      localStorage.setItem('user', JSON.stringify({password: CryptoJS.AES.encrypt(JSON.stringify(this.password), '123').toString(), email: this.email, active: true}))
      localStorage.setItem('auth', JSON.stringify({ authenticated: true }))
      router.push({ path: 'base' })
    },
    checkSession() {
      if (this.user.active) {
        this.session = true
      } else {
        this.session = false
      }
    },
    decryptPassword() {
      var bytes  = CryptoJS.AES.decrypt(this.user.password, '123');
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      console.log(decryptedData)
      return decryptedData
    },
    getUser () {
       this.user = JSON.parse(localStorage.getItem('user'))
       console.log(this.user)
    },
    authenticate() {
      if(this.email === this.user.email && this.decryptPassword() === this.password) {
        localStorage.setItem('auth', JSON.stringify({ authenticated: true }))
        router.push({ path: 'base' })
      } else {
        localStorage.setItem('auth', JSON.stringify({ authenticated: false }))
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
  font-family: Montserrat;
}
.logo-style {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  max-width: 134px;
  padding-bottom: 108px;
}
.card-style {
  height: 63px;
  width: 100%;
  padding-left: 6px;
  border-bottom: #e8e8e8 1px solid;
  border-left: #914B96 6px solid;
  font-family: Montserrat, light;
  font-weight: bold;
  color: #6A6A6A
}
.shadowloginfields {
  box-shadow: 2px -0.3px 7px 7px #f7f8f9;
  height: 126px;
  max-width: 80%;
  height: 126px;
  margin-left: auto;
  margin-right: auto;
  /* border: 1px solid hotpink */
}
.loginbuttons {
  display:block;
  max-width: 250px;
  width:100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 38px;
  margin-bottom: 38px;
}
.loginbutton {
  float: right;
  max-width: 80%;
  font-family: Montserrat, light;
  font-weight: bold;
  margin-top: 38px;
  margin-bottom: 20px;
  margin-right: 15px;
}
.forgetbutton {
  color: #914B96;
  display: block;
  font-family: Montserrat, light;
  font-size: 14px;
  margin-bottom: 20px;
  margin-top: 38px;
  margin-left: 45px;
  margin-right: 15px;
}
/* tan code */
.tan-style.pa-0 {
  font-family: Montserrat, light;
}
</style>
