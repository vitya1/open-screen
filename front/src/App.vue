<template>
  <div id="app" class="ui container">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">Why this service?</router-link>
      <span class="ui red tag label mini">Beta!</span>
    </div>

    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
