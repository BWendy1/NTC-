<template>
  <div class="home">
      <HeaderContainer>
      </HeaderContainer>
      <router-view class="content-body"></router-view>
  </div>
</template>

<script>
import HeaderContainer from './common/HeaderContainer'
export default {
  name: 'Home',
  components: {
    HeaderContainer
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .home {
    width: 100%;
    .content-body {
      margin-top: 100px;
    }
  }
</style>
