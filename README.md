# Eccheuma

![eccheuma-header](https://unfruhyobjypfbvnncoc.supabase.in/storage/v1/object/public/main/GitHubBadge.png)

[![Run tests](https://github.com/Scarlatum/eccheuma/actions/workflows/node.test.yml/badge.svg)](https://github.com/Scarlatum/eccheuma/actions/workflows/node.test.yml)
[![CodeQL](https://github.com/Scarlatum/eccheuma/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Scarlatum/eccheuma/actions/workflows/codeql-analysis.yml)

[pixi-logo]: https://avatars.githubusercontent.com/u/5406849?s=100&v=4
[vue-logo]: https://avatars.githubusercontent.com/u/6128107?s=100&v=4
[firebase-logo]: https://avatars.githubusercontent.com/u/1335026?s=100&v=4
[nuxt-logo]: https://avatars.githubusercontent.com/u/23360933?s=100&v=4

![Metrics](https://metrics.lecoq.io/Scarlatum)

## Технологии:

### Фронтенд

- [Vue](https://github.com/vuejs/vue)
- [Anime.js](https://github.com/juliangarnier/anime)
- [Pixi.js](https://github.com/pixijs)

### Бэкенд

- [Nuxt](https://github.com/nuxt)
- [Firebase](https://github.com/firebase/)

### Графический дизайн

- [Figma](https://www.figma.com/proto/t6xVQlDqCRfxQOobCyydJj/Ecchema?page-id=216%3A106&node-id=273%3A705&viewport=402%2C48%2C0.08&scaling=scale-down-width&starting-point-node-id=273%3A705) : Кликабельный прототип

## Основные задачи приложения:

- Удобный доступ к портфолио и его подробное описание.
- Личный кабинет с чатом, списком заказов, и настройками профиля.
- Блог с комментариями и оценками.
- Перечень услуг, цен, сроков. С подробным описание технологий, инструментов, и сервисов.

## Планы на дальнейшее развитие:

- Переход на новый API Firebase.
- По немногу готовиться к миграции на Vue 3 для ключевых компонентов.
- Отказаться от Pixi.js и написать простой аналог под определённый спектр задач. 400кб может быть и не так много, но много для пары утилит и начального экрана.
- Более удобная админ-панель с нормальным редактором статей.
- Нормальные системные уведомления для пользователя о новых сообщениях.
- Раздел с "эксперементами" для наглядной демонстрации технологий.
- Вариант запускать прототип Figm'ы в IFrame в дизайн кейсах. Сомнительно, но попробовать стоит. По крайней мере для десктопов.

---

## Небольшая предыстория становления приложения:
Изначально, всё это, было не более чем сайт с галереей, картинками, контактами для связи, и блогом представляющим из себя куски текста.
И так как это являлось первой попыткой сделать что-то впервые, писалось это на чистом JS\CSS\HTML. А это, в свою очередь, не давало никакой надежды для БЫСТРОГО расширения, по мере поступления нужды в оном. Начались проблемы с внедрением интерактивного и динамического функционала. Так этот феникс впервые сгорел, и начал своё первое перевоплощение...

### Шаблонизатор | Заведомый путь в никуда.
Следующей попыткой была реализация сайта на JAM подходе. Был выбран шаблонизатор Jakyll, написанна разметка, впервые использован SASS для стилизации.
В этот же момент пришло осознание того, что компоненты - Это классная вещь. И написание нового сайта на костях старого было значительно быстрее. Но всё это лишь решило проблему шаблонизации. Идеи для функционал всё приходили. Навыки росли. 

Шаблонизатора стало нехватать и захотелось большего... Так феникс сгорел второй раз.

### Vue.js | Становление SPA.
На этот раз наступило знакомство со Vue. И пожалуй можно сказать, что именно с этого момента данный проект начал стоять на ногах более уверенно. Все та же идея компонентов, но теперь ещё с их стилизацией и разметкой в одном месте. Реактивность интерфейса. Роутинг меж страницами за место их полной перезагрузки. Процесс пошёл ещё быстрее. Так сайт начал превращаться в приложение. Некая эволюция из статического JAM сайта в новомодное SPA. Компоненты росли. Крепчали. Заводили себе состояния.

Но и тут пришла проблема - Индексация контента поисковыми роботами. На тот момент единственный чьи поисковые роботы "рендерили" SPA приложения были Гугл. Ни Яндекс, и тем более не ребята, что поменьше, этим не занимались. И казалось бы, и что? Трафик из поисковой выдачи крайне мал, и перестройка всего приложения не стоит всех тех пары лишних заходов клиентов...

Но проблемы были куда серьёзнее: Производительность. Время до первой отрисовки. Долгое время простоя до интерактивности. И пожалуй самое серьёзное - Большое... ОГРОМНОЕ количество зависимостей внутри приложения. Начиная от свайперов контента, заканчивая UI библеотекой, сеткой Bootstrap'а, и крайне простых зависимостей, которые накладывали свои ограничения. В данный момент это можно было сравнить с тем, что феникс навесив на себя реактивный двигатель, ракетную обшивку на тушу, и пару ракет "воздух-воздух" влетел в чан с мазутом, и начал в нём медленно тонуть под своим весом.

### Nuxt.js | Падение SPA, и приход его альтернативы
И того, нужно было решить проблемы зависимостей и рендера. На сцену выходит Nuxt. Фреймворк для фреймворка. Который даёт возможность без сильный вложений переписать SPA приложение на SSR манер. Вместе с этим мы получаем возможность генерации контента для поисковых роботов. Более удобная экосистема и некоторые ограничения архитектуры. И если проблемы переноса приложения на Nuxt не вызвало какой-то большой проблемы, то избавление от большо количество зависимостей - Заняло более 5 месяцев.

Началась эпоха ренессанса...

### Typescript | Переход на TypeScript, переписывание зависимостей на свои решения, и рост в ширину.
И так начался новый виток, ещё более занятный чем предыдущие. Началось осваивание TypeScript'а, что привнесло хоть какое-то подобие типизации в JS. Это же, в свою очередь, очень сильно сказалось, что на уровне кода, что на количестве связанных с ним проблем. Больше кода - Меньше проблем?

Теперь же вместо компонентов которые берут "ЧТО-ТО" из "ЧЕГО-ТО", и пытаются это "ЧТО-ТО" обработать. Мы имеем полноценное представление о том какие данные нам приходят, с чем они связанны.

```typescript
type POST = {
	ID: string,
	authorID: string
	comment: Array<COMMENT>
	content: POST_CONTENT
	likes?: Array<USER_ID>
	...
}
```

---
