export const enum languages {
  Russian,
  English,
}

export namespace russian {

  export const userStatus = {
    Admin     : 'Администратор',
    Moderator : 'Модератор',
    User      : 'Пользователь'
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

}

export function getLocale(lang: languages) {
  switch (lang) {
    case languages.Russian: 
      return russian
    default: 
      return russian
  }
}
