var ConfirmfmvOptions = {}

ConfirmfmvOptions.onLoad = function() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var confirmFolderDrag = prefs.getBoolPref("folders.drag.confirm");
    var disableDrag = prefs.getBoolPref("folders.drag.disable-dialog");
    var checkbox = document.getElementById("checkbox_confirmfmvSwitch");
    var checkbox_disable = document.getElementById("checkbox_confirmfmvDisableDialog");
    if (confirmFolderDrag)
        checkbox.setAttribute("checked", "true");
    if (disableDrag)
        checkbox_disable.setAttribute("checked", "true");
    ConfirmfmvOptions.setup();
}

ConfirmfmvOptions.onUnload = function() {
    // do nothing
}

ConfirmfmvOptions.setup = function() {
    var checkbox = document.getElementById("checkbox_confirmfmvSwitch");
    var checkbox_disable = document.getElementById("checkbox_confirmfmvDisableDialog");
    if (checkbox.checked)
        checkbox_disable.removeAttribute("disabled");
    else
        checkbox_disable.setAttribute("disabled", "true");
}

ConfirmfmvOptions.save = function() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var checkbox = document.getElementById("checkbox_confirmfmvSwitch");
    var checkbox_disable = document.getElementById("checkbox_confirmfmvDisableDialog");

    prefs.setBoolPref("folders.drag.confirm", checkbox.checked);
    prefs.setBoolPref("folders.drag.disable-dialog", checkbox_disable.checked);

    window.close();
}
