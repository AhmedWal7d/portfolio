$(function () {

    /**
     * Web3Forms — access_key معرّف في index.html (حقل مخفي في النموذج).
     */
    function getWeb3AccessKey() {
        var $k = $('#contactForm input[name="access_key"]');
        return ($k.length && $k.val()) ? $.trim($k.val()) : '';
    }

    $("#contactForm input, #contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
        },
        submitSuccess: function ($form, event) {
            event.preventDefault();
            var name = $("input#name").val();
            var email = $("input#email").val();
            var subject = $("input#subject").val();
            var message = $("textarea#message").val();

            var $btn = $("#sendMessageButton");
            $btn.prop("disabled", true);

            var accessKey = getWeb3AccessKey();
            if (!accessKey) {
                $('#success').html("<div class='alert alert-warning text-left'>");
                $('#success > .alert-warning').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>");
                $('#success > .alert-warning').append("<strong>لم يُضبط مفتاح الإرسال.</strong> تأكد من وجود الحقل المخفي <code>access_key</code> في النموذج.");
                $('#success > .alert-warning').append('</div>');
                $btn.prop("disabled", false);
                return;
            }

            $.ajax({
                url: "https://api.web3forms.com/submit",
                type: "POST",
                dataType: "json",
                data: {
                    access_key: accessKey,
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    from_name: "Portfolio — " + name
                },
                cache: false,
                success: function (response) {
                    if (response && response.success) {
                        $('#success').html("<div class='alert alert-success'>");
                        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-success')
                            .append("<strong>تم الإرسال بنجاح. سأتواصل معك قريباً.</strong>");
                        $('#success > .alert-success')
                            .append('</div>');
                        $('#contactForm').trigger("reset");
                    } else {
                        $('#success').html("<div class='alert alert-danger'>");
                        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                            .append("</button>");
                        $('#success > .alert-danger').append($("<strong>").text(
                            (response && response.message) ? response.message : "تعذّر الإرسال. حاول مرة أخرى."
                        ));
                        $('#success > .alert-danger').append('</div>');
                    }
                },
                error: function () {
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append($("<strong>").text("حدث خطأ في الشبكة. تحقق من الاتصال أو حاول لاحقاً."));
                    $('#success > .alert-danger').append('</div>');
                },
                complete: function () {
                    setTimeout(function () {
                        $btn.prop("disabled", false);
                    }, 1000);
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$('#name').focus(function () {
    $('#success').html('');
});
