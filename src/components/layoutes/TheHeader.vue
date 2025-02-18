<template>
  <header>
    <div class="nav-links" v-for="route in PUBLIC_ROUTES">
      <router-link
        class="nav-link"
        tag="div"
        :to="route.path"
        :key="route.path"
        >{{ route.name }}</router-link
      >
    </div>
  </header>
</template>

<script setup>
import PUBLIC_ROUTES from '@/utils/constants/router.constants.js';
</script>

<style scoped>
header {
  padding: 20px;
  display: flex;
  border-bottom: 1px solid black;
}

.nav-links {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-link {
  font-size: 1.5rem;
}

.nav-link:hover,
.nav-link.router-link-active {
  text-decoration: underline;
}
</style>
