
import type { Categories } from '~/types/Services';

import { navigation } from '~/types/Navigation';
import { math } from '~/utils/math';

export const enum languages {
  Russian = 'ru_RU',
  English = 'en_EN',
}

export namespace russian {

  export namespace types  {
    export type CustomPlural = Array<[number, string]>;
  }

  export function getSuffix(num: number, suffix: Array<string>, customNumerator?: types.CustomPlural): string {

    const rem = num % 20;

    if ( customNumerator?.length ) {

      let customSuffix = String();

      customNumerator.forEach(([ n, str ]) => {
        if ( rem === n ) {
          customSuffix = str;
        }
      });

      return customSuffix || getSuffix(num, suffix);

    }

    if ( rem === 0 || rem % 10 === 1 ) return suffix[0];

    if ( math.int.inRange(2, rem, 4) ) return suffix[1];

    return suffix[2];

  }

  export const blacklist: Array<string> = ['аниме'];

  export const userStatus = {
    Admin     : 'Администратор',
    Moderator : 'Модератор',
    Support   : 'Поддержка',
    User      : 'Пользователь',
  };

  export const Routes: Record<keyof typeof navigation.routeSections, string> = {
    recommendation  : 'Рекомендации',
    portfolio       : 'Работы',
    service         : 'Услуги',
    gallery         : 'Галерея',
    home            : 'Главная',
  };

  export const Pagination = {
    page  : 'Страница',
    next  : 'Следующая',
    prev  : 'Предыдущая',
    last  : 'Последняя',
    first : 'Начальная',
  };

  export const PurchaseStatus = {
    None    : 'Отсутствует',
    Review  : 'Отправлен на рассмотрение',
    Queue   : 'Поставлен в очередь',
    Process : 'В процессе выполнения',
    Ready   : 'Ожидает проверку',
    Done    : 'Выполнен',
    Denied  : 'Отменён'
  };

  export const Application = {
		Landing   : 'Лэндинг',
		Multipage : 'Многостраничник',
	};

  export const authError = {
    'auth/network-request-failed'	: 'Ошибка соединения',
    'auth/user-not-found' 				: 'Пользователя с такой почтой не существует',
    'auth/invalid-email' 					: 'Поле не соответствует критериям почты',
    'auth/wrong-password'					: 'Неверный пароль',
    'auth/email-already-in-use' 	: 'Данная почта занята другим пользователем',
    'auth/weak-password'          : 'Слабый пароль',
  };

  export const fileInput = {
    sizeStrict  : 'Загружаемый размер файла привышает 1.5МБ: Размер вашего изображения:',
    sendError   : 'При отправке изображения произошла ошибка',
    loadError   : 'При загрузке изображения произошла ошибка',
  };

  export const Categories: Record<Categories, string> = {
    Application : 'Приложения',
    FrontEnd    : 'Фронт-энд',
    Graphic     : 'Графический дизайн',
  };

}

export namespace english {
  export const fileInput = {
    FilesizeStrict: 'File size limit is 1.5MB. Your is:'
  };
}

export function getLocale(lang: languages) {
  switch (lang) {
    case languages.Russian: 
      return russian;
    default: 
      return russian;
  }
}
