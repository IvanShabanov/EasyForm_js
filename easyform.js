
'use strict';

class EasyForm {

    constructor(options) {
        this.options = this.DefaultOptions(options);
    };

    Goal(ymID, GOALNAME) {
        if (GOALNAME != '') {
            var yc = 'yaCounter' + ymID;
            /* Проверим загрузился ли счетчик Yandex */
            if (typeof window[yc] !== 'undefined') {
                window[yc].reachGoal(GOALNAME);
            };
            if (typeof ym !== 'undefined') {
                ym(ymID, 'reachGoal', GOALNAME);
            };
            /* Проверим загрузился ли Google Analytics */
            if (typeof ga !== 'undefined') {
                ga('send', 'event', 'form', 'submit', GOALNAME);
            };
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_send', {
                    'event_category': 'form',
                    'event_action': 'submit',
                    'event_label': GOALNAME
                });
            };
        };
    };

    GenerateId(prefix) {
        return 'id_' + prefix + '_' + Date.now() + parseInt(Math.floor(Math.random() * (99999 - 999)) + 9999);
    };

    AddField(options) {
        var field = $.extend({
            'name': this.GenerateId('name'),
            'type': 'text',
            'placeholder': '',
            'title': '',
            'requred': '',
            'value': '',
            'label': '',
            'id': this.GenerateId('ef_field'),
        }, options);
        return field;
    };

    DefaultOptions(options) {
        var settings = $.extend({
            'fields': {
                'name': this.AddField({
                    'placeholder': 'Ваше имя',
                    'title': 'Ваше имя',
                    'label': 'Ваше имя: ',
                }),
                'phone': this.AddField({
                    'placeholder': 'Номер телефона',
                    'title': 'Номер телефона',
                    'label': 'Номер телефона: ',
                    'requred': 'requred',
                }),
            },
            'submitButton': 'Отправить',
            'messageSend': 'Ваше сообщение отправлено',
            'messageSending': 'Отправка...',
            'messageError': 'Что-то пошло не так, попробуйте позже.',
            'messageErrorRequred': 'Заполните обязательное поле',
            'action': '',
            'ymID': '',
            'goal': 'sendform',
            'class': '',
            'id': this.GenerateId('el_form'),
            'htmlBefore': '',
            'htmlAfter': '',
            'beforeShow': function () { return true; },
            'afterShow': function () { return true; },
            'beforeSend': function () { return true; },
            'afterSend': function () { return true; },
            'status': '',
        }, options);
        return settings;
    };

    GenerateForm() {
        var form = '';
        form += '<form';
        form += ' id="' + this.options['id'] + '"';
        form += ' class="' + this.options['class'] + '"';
        form += ' action="' + this.options['action'] + '"';
        form += '>';
        form += this.options['htmlBefore'];
        for (var name in this.options['fields']) {
            var field = this.AddField(this.options['fields'][name]);
            field['name'] = name;
            form += '<div class="form-group ' + field['type'] + '">';
            if (field['label'] != '') {
                form += '<label class="control-label" for="' + field['id'] + '">';
                form += field['label'];
                form += '</label>';
            };
            if (field['type'] == 'textarea') {
                form += '<textarea ';
            } else {
                form += '<input ';
            };
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
            };
            form += '</div>';
        };
        form += '<button type="submit" class="btn btn-default">' + this.options['submitButton'] + '</button>';
        form += this.options['htmlAfter'];
        form += '<div class="formMessage alert alert-primary" role="alert"></div>';
        form += '</form>';
        return form;
    };

    ShowForm() {
        var $this = this;
        if (typeof this.options['   beforeShow'] == 'function') {
            this.options['beforeShow']();
        }

        document.write(this.GenerateForm());

        if (typeof this.options['afterShow'] == 'function') {
            this.options['afterShow']();
        }

        $('#' + this.options['id']).submit(function (event) {
            var cansend = true;
            event.preventDefault();

            if (typeof $this.options['beforeSend'] == 'function') {
                cansend = $this.options['beforeSend']();
            };
            if (cansend) {

                if ($this.options['status'] == '') {
                    $this.options['status'] = 'sending';
                    var form = $(this);
                    var data = $(form).serialize();
                    var url = $(form).attr('action');
                    $(form).find('.formMessage').html($this.options['messageSending']);

                    $.ajax({
                        url: url,
                        type: 'post',
                        data: data,
                        success: function (result) {
                            var isOk = true;
                            if (typeof $this.options['afterSend'] == 'function') {
                                isOk = $this.options['afterSend'](result);
                            };
                            if (isOk) {
                                $(form).find('.form-control').val('');
                                $(form).find('.formMessage').html($this.options['messageSend']);
                                $this.Goal($this.options['ymID'], $this.options['goal']);
                            };
                            $this.options['status'] = '';
                        },
                        error: function (result) {
                            $(form).find('.formMessage').html($this.options['messageError']);
                            $this.options['status'] = '';
                        }
                    });
                };
            };
        });
    };
};