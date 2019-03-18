
function ef_Goal(ymID, GOALNAME) {
    if (GOALNAME != '') {
        var yc = 'yaCounter' + ymID;
        /* Проверим загрузился ли счетчик Yandex */
        if (typeof window[yc] !== 'undefined') {
            window[yc].reachGoal(GOALNAME);
        }
        if (typeof ym !== 'undefined') {
            ym(ymID, 'reachGoal', GOALNAME);
        };
        /* Проверим загрузился ли Google Analytics */
        if (typeof ga !== 'undefined') {
            ga('send', 'event', 'form', 'submit', GOALNAME);
        }
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_send', {
                'event_category': 'form',
                'event_action': 'submit',
                'event_label': GOALNAME
            });
        };
    };
};

function ef_GenerateId(prefix) {
    return 'id_' + prefix + '_' + Date.now() + parseInt(Math.floor(Math.random() * (99999 - 999)) + 9999);
}

function ef_AddField(options) {
    var field = $.extend({
        'name': ef_GenerateId('name'),
        'type': 'text',
        'placeholder': '',
        'title': '',
        'requred': '',
        'value': '',
        'label': '',
        'id': ef_GenerateId('ef_field'),
    }, options);
    return field;
}

function ef_DefaultOptions(options) {
    var settings = $.extend({
        'fields': {
            'name': ef_AddField({
                'placeholder': 'Ваше имя',
                'title': 'Ваше имя',
                'label': 'Ваше имя: ',
            }),
            'phone': ef_AddField({
                'placeholder': 'Номер телефона',
                'title': 'Номер телефона',
                'label': 'Номер телефона: ',
                'requred': 'requred',
            }),
        },
        'submitButton': 'Отправить',
        'messageSend': 'Отправлено',
        'messageSending': 'Отправка...',
        'messageError': 'Ошибка при отправки формы, попробуйте позже.',
        'messageErrorRequred': 'Заполните обязательное поле',
        'action': '',
        'ymID': '',
        'goal': 'sendform',
        'class': '',
        'id': ef_GenerateId('el_form'),
        'htmlBefore': '',
        'htmlAfter': '',
        'beforeShow': function () { return true; },
        'afterShow': function () { return true; },
        'beforeSend': function () { return true; },
        'afterSend': function () { return true; },
    }, options);
    return settings;
}

function ef_AddForm(options) {
    var settings = ef_DefaultOptions(options);
    var form = '';
    form += '<form';
    form += ' id="' + settings['id'] + '"';
    form += ' class="' + settings['class'] + '"';
    form += ' action="' + settings['action'] + '"';
    form += '>';
    form += settings['htmlBefore'];
    for (var name in settings['fields']) {
        var field = ef_AddField(settings['fields'][name]);
        field['name'] = name;
        form += '<div class="form-group ' + field['type'] + '">';
        if (field['label'] != '') {
            form += '<label class="control-label" for="' + field['id'] + '">';
            form += field['label'];
            form += '</label>';
        }
        if (field['type'] == 'textarea') {
            form += '<textarea ';
        } else {
            form += '<input ';
        }
        for (var key in field) {
            form += 'class="form-control" ';
            if ((field[key] != '') && (key != 'label')) {
                form += '' + key + '="' + field[key] + '" '
            };
        };

        if (field['type'] == 'textarea') {
            form += '</textarea> ';
        } else {
            form += '/>';
        }
        form += '</div>';
    }
    form += '<button type="submit" class="btn btn-default">' + settings['submitButton'] + '</button>';
    form += settings['htmlAfter'];
    form += '<div class="formMessage alert alert-primary" role="alert"></div>';
    form += '</form>';

    settings['beforeShow']();

    document.write(form);

    settings['afterShow']();

    $('#' + settings['id']).submit(function (event) {
        event.preventDefault();
        console.log(settings);
        if (settings['beforeSend']()) {
            var form = $(this);
            var data = $(form).serialize();
            var url = $(form).attr('action');
            $(form).find('.formMessage').html(settings['messageSending']);
            $.ajax({
                url: url,
                type: 'post',
                data: data,
                success: function (result) {
                    $(form).find('.form-control').val('');
                    $(form).find('.formMessage').html(settings['messageSend']);
                    ef_Goal(settings['ymID'], settings['goal']);
                    settings['afterSend'](result);
                },
                error: function (result) {
                    $(form).find('.formMessage').html(settings['messageError']);
                    settings['afterSend'](result);
                }
            });
        };
    });

};
