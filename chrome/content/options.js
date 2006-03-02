var ConfirmfmvOptions = {}

ConfirmfmvOptions.onLoad = function() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var confirmFolderDrag = prefs.getBoolPref("folders.drag.confirm");
    var checkbox = document.getElementById("checkbox_confirmfmvSwitch");
    if (confirmFolderDrag)
        checkbox.setAttribute("checked", "true");
}

ConfirmfmvOptions.onUnload = function() {
    // do nothing
}

ConfirmfmvOptions.save = function() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var checkbox = document.getElementById("checkbox_confirmfmvSwitch");

    prefs.setBoolPref("folders.drag.confirm", checkbox.checked);

    window.close();
}
