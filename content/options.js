Preferences.addAll([
  { id: "extensions.confirmfmv.drag.confirm", type: "bool" },
  { id: "extensions.confirmfmv.drag.disableDialog", type: "bool" },
]);

var ConfirmfmvOptions = {}

ConfirmfmvOptions.setup = function() {
  let checkbox = document.getElementById("checkbox_confirmfmvSwitch");
  let checkbox_disable = document.getElementById("checkbox_confirmfmvDisableDialog");
  if (checkbox.checked) {
    checkbox_disable.removeAttribute("disabled");
  } else {
    checkbox_disable.setAttribute("disabled", "true");
  }
};
