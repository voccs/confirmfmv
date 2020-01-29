var ConfirmfmvOptions = {}

ConfirmfmvOptions.setup = function() {
    var checkbox = document.getElementById("checkbox_confirmfmvSwitch");
    var checkbox_disable = document.getElementById("checkbox_confirmfmvDisableDialog");
    if (checkbox.checked)
        checkbox_disable.removeAttribute("disabled");
    else
        checkbox_disable.setAttribute("disabled", "true");
};
