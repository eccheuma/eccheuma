export const enum languages {
  Russian,
  English,
}

export namespace russian {

  export const blacklist: Array<string> = ['аниме']

  export const userStatus = {
    Admin     : 'Администратор',
    Moderator : 'Модератор',
    Support   : 'Поддержка',
    User      : 'Пользователь',
  }

  export const PurchaseStatus = {
    None    : 'Отсутствует',
    Review  : 'Отправлен на рассмотрение',
    Queue   : 'Поставлен в очередь',
    Process : 'В процессе выполнения',
    Ready   : 'Ожидает проверку',
    Done    : 'Выполнен',
    Denied  : 'Отменён'
  }

  export const Application = {
		Landing   : 'Лэндинг',
		Multipage : 'Многостраничник',
	}

  export const authError = {
    'auth/network-request-failed'	: 'Ошибка соединения',
    'auth/user-not-found' 				: 'Пользователя с такой почтой не существует',
    'auth/invalid-email' 					: 'Поле не соответствует критериям почты',
    'auth/wrong-password'					: 'Неверный пароль',
    'auth/email-already-in-use' 	: 'Данная почта занята другим пользователем',
  }

  export const fileInput = {
    sizeStrict  : 'Загружаемый размер файла привышает 1.5МБ: Размер вашего изображения:',
    sendError   : 'При отправке изображения произошла ошибка',
    loadError   : 'При загрузке изображения произошла ошибка',
  }

}

export namespace english {
  export const fileInput = {
    FilesizeStrict: 'File size limit is 1.5MB. Your is:'
  }
}

export function getLocale(lang: languages) {
  switch (lang) {
    case languages.Russian: 
      return russian
    default: 
      return russian
  }
}
