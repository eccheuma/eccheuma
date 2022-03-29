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
          Напоминание с добрым умыслом:
        </template>
        <template #desc>
          Никогда не используйте один и тот же пароль на малознакомых сайтах. 
        </template>
      </caption-card>
    </transition>

    <section>
      <label for="RegistrationFormMail">
        <span>
          <strong>Почта</strong>
        </span>
      </label>
      <input 
        id="RegistrationFormMail" 
        v-model="form.email" 
        type="email"
        placeholder="profile@mail.com"
        @input="inputSound" 
        :class="validation.email ? 'valid' : 'invalid'"
        >
    </section>

    <section>
      <label for="RegistrationFormPass">
        <span>
          <strong>Пароль: </strong> Длинна не менее 6 символов
        </span>
      </label>
      <input 
        id="RegistrationFormPass" 
        v-model="form.password" 
        type="password"
        placeholder="Только латинские буквы и как минимум одна цифра"
        @input="inputSound" 
        :class="validation.password ? 'valid' : 'invalid'"
        >
    </section>

    <section>
      <label for="RegistrationFormName">
        <strong>Ваше имя</strong>
      </label>
      <input 
        id="RegistrationFormName" 
        v-model="form.name" 
        type="name" 
        placeholder="Будет выводится как имя профиля"
        @input="inputSound" 
        :class="validation.name ? 'valid' : 'invalid'"
        >
    </section>

    <hr>

    <eccheuma-button :class="{ disabled: invalidForm }" style="align-content: flex-end">
      {{ invalidForm ? 'Заполните или исправьте поля' : 'Отправить' }}
    </eccheuma-button>

  </form>
</template>

<style lang="scss">

.registration-form {
  &-container {

    display: grid;
    grid-template: {
      rows: repeat(4,min-content) 1fr min-content;
    }

    gap: 2vh;
    align-content: flex-start;

    width: 100%;
    height: 100%;

    > hr {
      width: 100%;
      height: 1px;
      background: rgb(var(--color-mono-300));
      margin: .5vh 0;
    }

    > section {

      display: grid;

      grid-template-columns: 100%;

      span {
        font-size: var(--font-size-16);
      }

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
          size: var(--font-size-16);
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
	import type { VuexMap } from '~/types/VuexMap'

  // MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

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
    mixins: [ EmitSound ],
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
      },

      invalidForm(): boolean {
        return Object.values(this.validation).some(x => x === false)
      },

    },
    watch: {
      form: {
        handler() {
          this.setAuthError(this.matchWithPrev ? this.prev.error : null);
        },
        deep: true,
      },
    },
    mounted() {
      
      if ( process.browser ) {

				this.setSounds([
					{ file: 'Off', name: 'Input::Increment', settings: { rate: 0.65, volume: .25 } },
					{ file: 'Off', name: 'Input::Decrement', settings: { rate: 0.50, volume: .25 } },
				])

			}

    },
    methods: {

      ...mapMutations({
        setAuthError: 'Auth/Session/setAuthError'
      }),

      sendForm() {

        this.prev.form = Object.create({ ...this.form });

        this.$emit('form-send', this.form);

      },

      inputSound(input: InputEvent) {
        this.playSound(this.Sounds.get(input.data ? 'Input::Increment' : 'Input::Decrement'))
			},

      getLocale(error: auth.error) {
        return getLocale(this.Lang).authError[error];
      },
      
    },
  })

</script>
