<template>
  <form class="registration-form-container" @submit.prevent="sendForm">

    <transition name="opacity-transition" mode="in-out">
      <caption-card v-if="AuthError" status="error">
        <template #type>
          {{ getLocale(AuthError) }}
        </template>
      </caption-card>
      <caption-card v-else status="default">
        <template #type>
          Lorem ipsum amete an darum
        </template>
      </caption-card>
    </transition>

    <section>
      <label for="RegistrationFormMail">
        <span>Электронная почта: </span>
      </label>
      <input 
        id="RegistrationFormMail" 
        v-model="form.email" 
        type="email" 
        :class="validation.email ? 'valid' : 'invalid'"
        >
    </section>

    <section>
      <label for="RegistrationFormPass">
        <span>Пароль: </span>
      </label>
      <input 
        id="RegistrationFormPass" 
        v-model="form.password" 
        type="password" 
        :class="validation.password ? 'valid' : 'invalid'"
        >
    </section>

    <section>
      <label for="RegistrationFormName">
        <span>Ваше имя: </span>
      </label>
      <input 
        id="RegistrationFormName" 
        v-model="form.name" 
        type="name" 
        name="Placeholder" 
        :class="validation.name ? 'valid' : 'invalid'"
        >
    </section>

    <hr>

    <eccheuma-button :class="{ disabled: Object.values(validation).some(x => x === false) }">
      Submit
    </eccheuma-button>

  </form>
</template>

<style lang="scss">

.registration-form {
  &-container {

    display: grid;
    gap: 2vh;
    align-content: center;

    width: 100%;

    hr {
      width: 100%;
      height: 1px;
      background: rgb(var(--color-mono-300));
      margin: .5vh 0;
    }

    section {

      display: grid;

      grid-template-columns: 100%;

      input {

        width: 100%;
        height: min-content;

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

      .valid {
        border: 2px solid var(--color-accent-pass) !important;
      }

      .invalid {
        border: 2px solid var(--color-accent-error) !important;
      }

    }
  }
}

</style>

<script lang="ts">

  // TODO | first prior component

  import Vue from 'vue'

  // VUEX
	import { mapState, mapMutations } from 'vuex'
	import type { VuexMap } from '~/typescript/VuexMap'

  // TYPES & INTERFACES & ENUMS
	import { form, auth } from '~/api/auth';
	import { validate } from '~/utils/validate';

  // LANG
  import { getLocale } from '~/lang'

  // COMPONENTS
  import EccheumaButton from '~/components/buttons/CommonButton.vue';
  import CaptionCard 	  from '~/components/common/Caption.vue';

  // PREDEFINED
  const PREDEFINED_FORM: form.registration = {
    email			: String() as form.registration['email'],
    password	: String(),
    name			: String(),
  };

  // MODULE
  export default Vue.extend({
    components: {
      EccheumaButton,
      CaptionCard
    },
    data() {
      return {
        form: PREDEFINED_FORM,
        prev: {
          form  : new Object() as form.registration,
          error : null as auth.error | null,
        }
      }
    },
    computed: {

      ...mapState({
				AuthError	:	state => (state as VuexMap).Auth.Session.AuthError,
        Lang      : state => (state as VuexMap).App.Lang,
			}),

      validation(): {[K in keyof form.registration]: boolean } {
				return {
					email			: !  this.matchWithPrev.email
                      && this.AuthError !== auth.error.takedEmail 
                      && validate.email(this.form.email),
					password	: validate.pass(this.form.password, 6),
					name			: Boolean(this.form.name.length),
				}
			},

      matchWithPrev(): {[K in keyof form.registration]: boolean } {
        return {
          email     : this.form.email     === this.prev.form.email,
          password  : this.form.password  === this.prev.form.password,
          name      : this.form.name      === this.prev.form.name
        }
      }

    },
    watch: {
      form: {
        handler() {
          this.ChangeAuthError(this.matchWithPrev ? this.prev.error : null);
        },
        deep: true,
      },
    },
    methods: {

      ...mapMutations({
        ChangeAuthError: 'Auth/Session/ChangeAuthError'
      }),

      sendForm() {

        this.prev.form = Object.create({ ...this.form });

        this.$emit('form-send', this.form);

      },

      getLocale(error: auth.error) {
        return getLocale(this.Lang).authError[error];
      },
      
    },
  })

</script>
