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
                    'required': 'required',
                }),
            },
            'submitButton': 'Отправить',
            'messageSend': 'Ваше сообщение отправлено',
            'messageSending': 'Отправка...',
            'messageError': 'Что-то пошло не так, попробуйте позже.',
            'action': '',
            'method': 'post',
            'class': '',
            'id': this.GenerateId('el_form'),
            'htmlBefore': '',
            'htmlAfter': '',
            'beforeShow': function () { return true; },
            'afterShow': function () { return true; },
            'beforeSend': function () { return true; },
            'afterSend': function () { return true; },
            'status': '',
            'isModal': false,
            'modalButton': {
                'text': 'Заказать',
                'class': '',
            },
            'modalHeader': 'Заказать',
            'modalFooter': '',
        }, options);
        return settings;
    };

    GenerateField(field) {
        var form = '';
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
            form += '>' + field['value'] + '</textarea> ';
        } else {
            form += '/>';
        };
        form += '</div>';
        return form;
    };

    GenerateForm() {
        var form = '';

        if (this.options['isModal']) {
            form += '<button type="button" class="btn btn-primary ' + this.options['modalButton']['class'] + '" data-bs-toggle="modal" data-bs-target="#modal' + this.options['id'] + '">';
            form += this.options['modalButton']['text'];
            form += '</button>';

            form += '<div class="modal fade" id="modal' + this.options['id'] + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
            form += '<div class="modal-dialog modal-dialog-centered" role="document">';
            form += '<div class="modal-content">';
        };

        form += '<form';
        form += ' id="' + this.options['id'] + '"';
        form += ' class="' + this.options['class'] + '"';
        form += ' action="' + this.options['action'] + '"';
        form += ' method="' + this.options['method'] + '"';
        form += '>';


        if (this.options['isModal']) {
            form += '<div class="modal-header">';
            form += '<h5 class="modal-title">' + this.options['modalHeader'] + '</h5>';
            form += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
            form += '</div>';

            form += '<div class="modal-body">';
        };

        form += this.options['htmlBefore'];
        for (var name in this.options['fields']) {
            var field = this.AddField(this.options['fields'][name]);
            field['name'] = name;
            form += this.GenerateField(field);
        };

        if (this.options['isModal']) {
            form += '</div>';
            form += '<div class="modal-footer">';
        };

        form += '<button type="submit" class="btn btn-default">' + this.options['submitButton'] + '</button>';
        form += this.options['htmlAfter'];
        form += '<div class="formMessage alert alert-primary" role="alert"></div>';

        if (this.options['isModal']) {
            form += this.options['modalFooter'];
            form += '</div>';
        };

        form += '</form>';

        if (this.options['isModal']) {
            form += '</div>';
            form += '</div>';
            form += '</div>';
        };
        this.options['status'] = '';
        return form;
    };

    ShowForm() {
        var $this = this;
        if (typeof this.options['beforeShow'] == 'function') {
            this.options['beforeShow']();
        }

        document.write(this.GenerateForm());

        if (typeof this.options['afterShow'] == 'function') {
            this.options['afterShow']();
        }
        $('#' + this.options['id']).find('.formMessage').hide();
        this.options['status'] = '';

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
                    $(form).find('.formMessage').show(200);
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
                            setTimeout(function () {
                                $(form).find('.formMessage').hide(200);
                            }, 3000);
                        },
                        error: function (result) {
                            $(form).find('.formMessage').html($this.options['messageError']);
                            $this.options['status'] = '';
                            setTimeout(function () {
                                $(form).find('.formMessage').hide(200);
                            }, 3000);

                        }
                    });
                };
            };
        });
    };



};