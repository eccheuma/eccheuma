<template>
  <div class="section-header">
    <slot name="header" />
    <slot />
  </div>
</template>

<style lang="scss">

.section-header {

  height: 20vh;
  display: grid;

  place-content: center;
  // background-color: rgb(var(--color-mono-200));
  color: rgb(var(--color-mono-700));

  border-radius: .7rem;

  span {

    display: block;
    text-align: center;

    &:nth-child(1) {
      font: {
        size: var(--font-size-48);
        family: var(--decor-font);
        weight: 900;
      }

      letter-spacing: .25ch;
    }
    &:nth-child(2) {
      font: {
        size: var(--font-size-18);
        weight: 600;
      }
    }
  }

}

</style>
