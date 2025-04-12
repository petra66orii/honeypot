// JS was created using the Boutique Ado walkthrough project
// configuration and adapted using the official Stripe JS documentation:
// https://docs.stripe.com/js/

var stripe_public_key = $('#id_stripe_public_key').text().slice(1, -1);
var client_secret = $('#id_client_secret').text().slice(1, -1);
var stripe = Stripe(stripe_public_key);
const options = {
    clientSecret: client_secret,
    appearance:  {
        theme: 'stripe',
        variables: {
            colorPrimary: '#b973da',
            colorBackground: '#f5f5f5',
            colorText: '#b973da',
            colorDanger: '#df1b41',
            fontFamily: 'Times New Roman, system-ui, sans-serif',
            spacingUnit: '2px',
            borderRadius: '4px',
        }
    },
};

const elements = stripe.elements(options);
const paymentElementOptions = {layout: 'accordion'}
const paymentElement = elements.create('payment', paymentElementOptions);
paymentElement.mount('#payment-element');

var form = document.getElementById('payment-form');

form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    
    $('#submit-button').attr('disabled', true);
    $('#loading-overlay').fadeToggle(100);

    const saveInfo = Boolean($('#id-save-info').attr('checked'));
    const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
    const postData = {
        csrfmiddlewaretoken: csrfToken,
        client_secret: client_secret,
        save_info: saveInfo,
    };
    const url = '/checkout/cache_checkout_data/';

    $.post(url, postData).done(function () {
        stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "https://honeypot-6aa199604c8f.herokuapp.com/checkout/success/",
                payment_method_data: {
                    billing_details: {
                        name: $.trim(form.first_name.value) + ' ' + $.trim(form.last_name.value),
                        email: $.trim(form.email.value),
                        phone: $.trim(form.phone_number.value),
                        address: {
                            line1: $.trim(form.street_address1.value),
                            line2: $.trim(form.street_address2.value),
                            city: $.trim(form.town.value),
                            country: $.trim(form.country.value),
                            state: $.trim(form.county.value),
                        }
                    }
                }
            }
        }).then(function (result) {
            if (result.error) {
                const errorDiv = document.getElementById('card-errors');
                const html = `
                    <span class="icon" role="alert">
                        <i class="fas fa-exclamation-circle"></i>
                    </span>
                    <span>${result.error.message}</span>`;
                $(errorDiv).html(html);
                $('#loading-overlay').fadeToggle(100);
                $('#submit-button').attr('disabled', false);
            }
            // On success, Stripe will redirect to `return_url`
        });
    }).fail(function () {
        location.reload();
    });
});
