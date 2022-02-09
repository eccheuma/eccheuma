<template>
  <form action="" method="post" class="registration-form-container">

    <section>
      <label for="RegistrationFormMail">
        <span>Электронная почта: </span>
      </label>
      <input id="RegistrationFormMail" type="email" name="ertert">
    </section>

    <section>
      <label for="RegistrationFormPass">
        <span>Пароль: </span>
      </label>
      <input id="RegistrationFormPass" type="password" name="ertertert">
    </section>

    <section>
      <label for="RegistrationFormName">
        <span>Ваше имя: </span>
      </label>
      <input id="RegistrationFormName" type="name" name="ertertert" @input="sendForm">
    </section>

    <eccheuma-button @click.prevent="sendForm">
      Submit
    </eccheuma-button>

  </form>
</template>

<style lang="scss">

.registration-form {
  &-container {

    display: grid;
    gap: 2vh;

    width: 100%;

    section {

      display: grid;

      grid-template-columns: 100%;

      input {

        width: 100%;

        color: rgb(var(--color-mono-900));
        background-color: rgb(var(--color-mono-300));
        border: 2px solid var(--color-accent-edges-100);

        border: {
          radius: var(--border-radius);
        }

        padding: 1vh 1vw;

        font: {
          size: var(--font-size-14);
          weight: 600;
        }

        line-height: 3vh;

        transition-duration: 500ms;
        &:focus {
          outline: 0px solid transparent;
          border-color: var(--color-accent-edges-300);
        }

      }

    }
  }
}

</style>

<script lang="ts">

  // TODO | first prior component

  import Vue from 'vue'

  // COMPONENTS
  import EccheumaButton from '~/components/buttons/CommonButton.vue';

  // MODULE
  export default Vue.extend({
    components: {
      EccheumaButton
    },
    data() {
      return {
        test: 'test'
      }
    },
    methods: {
      // ! Remove placeholder methods
      sendForm() {
        console.log(this.test);
      }
    },
  })

</script>
