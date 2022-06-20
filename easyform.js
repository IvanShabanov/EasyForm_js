'use strict';

class EasyForm {

    constructor(options) {
        this.options = this.DefaultOptions(options);
    };

    GenerateId(prefix) {
        return 'id_' + prefix + '_' + Date.now() + parseInt(Math.floor(Math.random() * (99999 - 999)) + 9999);
    };

    AddField(options) {
        let field = this.extend({
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
        let settings = this.extend({
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
        let form = '';
        form += '<div class="mb-3 ' + field['type'] + '">';
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
        for (let key in field) {
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
        let form = '';

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
        for (let name in this.options['fields']) {
            let field = this.AddField(this.options['fields'][name]);
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

    ShowForm(selector) {
        let this_class = this;
        if (typeof this_class.options['beforeShow'] == 'function') {
            this_class.options['beforeShow']();
        }

        if (typeof selector !== 'undefined') {
            let place = document.querySelector(selector);
            if (typeof place !== 'undefined') {
                place.innerHTML = this_class.GenerateForm();
            }
        } else {
            document.write(this_class.GenerateForm());
        }

        if (typeof this_class.options['afterShow'] == 'function') {
            this_class.options['afterShow']();
        }
        let this_form = document.querySelector('#' + this_class.options['id']);
        if (typeof this_form !== 'undefined') {
            let message_div = this_form.find('.formMessage');
            if (typeof message_div !== 'undefined') {
                message_div.classList.add('hidden');
            };
            ththis_classis.options['status'] = '';


        }

        this_form.addEventListener('submit', function (event) {
            let cansend = true;
            event.preventDefault();

            if (typeof this_class.options['beforeSend'] == 'function') {
                cansend = this_class.options['beforeSend']();
            };
            if (cansend) {

                if (this_class.options['status'] == '') {
                    this_class.options['status'] = 'sending';
                    let data = new FormData(this_form);
                    let url = this_form.getAttribute('action');
                    message_div.innerHTML = this_class.options['messageSending'];
                    message_div.classList.remove('hidden');


                    fetch(url,{
                        method: 'POST',
                        body: data,
                    }).then(function (response) {
                        return response.text(); /* to get HTML */
                        //return response.json(); /* to get JSON */
                    }).then(function (result) {
                        let isOk = true;
                        if (typeof this_class.options['afterSend'] == 'function') {
                            isOk = this_class.options['afterSend'](result);
                        };
                        if (isOk) {
                            this_form.reset();
                            message_div.innerHTML = this_class.options['messageSend'];
                        };
                        this_class.options['status'] = '';
                        setTimeout(function () {
                            message_div.classList.add('hidden');
                        }, 3000);
                    })
                    .catch(function (err) {
                        message_div.innerHTML = this_class.options['messageError']
                        setTimeout(function () {
                            message_div.classList.add('hidden');
                        }, 3000);
                    });
                };
            };
        });
    };

    extend(){
        for(var i=1; i<arguments.length; i++)
            for(var key in arguments[i])
                if(arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    };

};