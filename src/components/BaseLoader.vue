<template>
  <div class="loader" :class="size"></div>
</template>

<script>
export default {
  props: ['size'],
}
</script>
<style>
.loader-wrapper {
  width: max-content;
  margin: 0 auto;
  padding: 50px 0;
}

.loader {
  display: inline-block;
  width: 80px;
  height: 80px;
  margin: 0 auto
}

.loader::after {
  content: '';
  display: block;
  width: 70%;
  height: 70%;
  margin: 10px;
  border-radius: 40%;
  border: 3px solid #e02d71;
  border-color: #e02d71 transparent #e02d71 transparent;
  animation: loader 1s linear infinite;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
