export const store = {
  tableHeadRowItems: [
    {
      name: 'ID',
      idLastPart: 'id',
      isSortable: true,
      isSortActive: true,
    },
    {
      name: 'Фамилия Имя Отчество',
      idLastPart: 'full-name',
      isSortable: true,
      isString: true,
    },
    {
      name: 'Дата и время создания',
      idLastPart: 'create',
      isSortable: true,
    },
    {
      name: 'Последние изменения',
      idLastPart: 'change',
      isSortable: true,
    },
    {
      name: 'Контакты',
      idLastPart: 'contacts',
    },
    {
      name: 'Действия',
      idLastPart: 'actions',
    },
  ],
};
