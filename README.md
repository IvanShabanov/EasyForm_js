# EasyForm
Создание Bootstrap формы средствами JS


Как пользоваться:


  <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
    <script src='//yastatic.net/jquery/3.3.1/jquery.min.js' type='text/javascript'></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
    <script src="easyform.js"></script>
  </head>
  <body>
  ....
  Сюда добавим форму 
     <script>
        var form = new EasyForm();
        /* Меняем опции формы */
        form.options['isModal'] = true;
        form.options['modalButton'] = {
                'text': 'Открыть форму',
                'class': '',
            };
        /* Поля формы */
        form.options['fields'] = {
            'phone': form.AddField({
                'placeholder': 'Номер телефона',
                'title': 'Введите номер телефона',
            })
        };
        /* Выводим форму */
        form.ShowForm();
    </script>
  ...
  </body>  


Опции формы:

            'fields': {                             /* Описываем поля формы */
                'name': this.AddField({
                    'placeholder': 'Ваше имя',   
                    'title': 'Ваше имя',
                    'label': 'Ваше имя: ',
                }),
                'phone': this.AddField({
                    'placeholder': 'Номер телефона',
                    'title': 'Номер телефона',
                    'label': 'Номер телефона: ',
                    'required': 'required',
                }),
            },
            'submitButton': 'Отправить',            /* текст на кнопке отправить */
            'messageSend': 'Ваше сообщение отправлено',     /* Сообщение после успешной отправки */
            'messageSending': 'Отправка...',        /* Сообщение во время отправки */
            'messageError': 'Что-то пошло не так, попробуйте позже.',   /* Сообщение о ошибки во время отправки */
            'action': '',                           /* Адрес программы или документа, который обрабатывает данные формы. */
            'method': 'post',                       /* Метод протокола HTTP */
            'ymID': '',                             /* ID счетчика Yandex метрики */
            'goal': 'sendform',                     /* идентификатор цели Yandex метрики и/или Google Analitics */
            'class': '',                            /* Класс формы */
            'id': this.GenerateId('el_form'),       /* ID формы */
            'htmlBefore': '',                       /* html Текст выводимый перед формой  */
            'htmlAfter': '',                        /* html Текст выводимый после формой */
            'beforeShow': function () { return true; },     /* Функция сработает перед отображением формы */
            'afterShow': function () { return true; },      /* Функция сработает после отображением формы */
            'beforeSend': function () { return true; },     /* Функция сработает перед отправкой формы, проверить данные формы и т.п. должна вернуть true если все ок */
            'afterSend': function () { return true; },      /* Функция сработает после отправки формы, проверить данные полученые от обработкика формы и т.п. должна вернуть true если все ок */
            'status': '',                           /* Служебная переменная */
            'isModal': false,                       /* модальная форма true/false */
            'modalButton': {                        /* Кнопка которая откроем модальное онко с формой */
                'text': 'Заказать',                     /* текст на кнопке */
                'class': '',                            /* класс кнопки */
            },
            'modalHeader': 'Заказать',              /* Заголовок модального онка */
            'modalFooter': '',                      /* текст в футере модального окна */
