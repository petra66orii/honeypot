// JS was created using the Boutique Ado walkthrough project
// configuration and adapted using the official Stripe JS documentation:
// https://docs.stripe.com/js/

var stripePublicKey = $('#id_stripe_public_key').text().slice(1, -1);
var clientSecret = $('#id_client_secret').text().slice(1, -1);
var stripe = Stripe(stripePublicKey);
const options = {
    clientSecret: clientSecret,
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
const paymentElementOptions = {layout: 'accordion'};
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
        'csrfmiddlewaretoken': csrfToken,
        'client_secret': clientSecret,
        'save_info': saveInfo,
    };
    const url = '/checkout/cache_checkout_data/';

    $.post(url, postData).done(function () {
        stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location}/checkout/checkout_success/`,
            },
            redirect: 'if_required'
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
            } else {
                // The payment has been processed!
                if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    form.submit();
                }
            }
        });
    }).fail(function () {
        location.reload();
    });
});
