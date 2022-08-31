
import { navigation } from '~/types/Navigation';
import { math } from '~/utils/math';

export const enum languages {
  Russian = 'ru_RU',
  English = 'en_EN',
}

export namespace russian {

  // Numeric
  const suffix = ['ой', 'ух', 'ёх', 'ми', 'ти'];

  export function getSuffix(num: number): string {

    const rem = num % 10;

    if ( rem === 1 && num !== 11 ) return suffix[0];

    if ( num < 10 || num > 20 ) {

      if ( rem === 2 ) return suffix[1];
      if ( math.int.inRange(1,rem,5) ) return suffix[2];
      if ( rem === 7 || rem === 8 ) return suffix[3];

    }

    return suffix[4];

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
