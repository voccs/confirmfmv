gFolderTreeView.drop = function ftv_drop(aRow, aOrientation) {
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    let targetFolder = gFolderTreeView._rowMap[aRow]._folder;

    let dt = this._currentTransfer;
    let count = dt.mozItemCount;
    let cs = Cc["@mozilla.org/messenger/messagecopyservice;1"]
                .getService(Ci.nsIMsgCopyService);

    // we only support drag of a single flavor at a time.
    let types = dt.mozTypesAt(0);
    if (Array.indexOf(types, "text/x-moz-folder") != -1) {
      // @@@MADE CHANGES HERE@@@
      // Moving folders is annoying if that's not actually what
      // somebody wanted to do.  So ASK FIRST.

      // get folder dragging pref
      let prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
      let confirmFolderDrag = prefs.getBoolPref("extensions.confirmfmv.drag.confirm");
      let promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
      let disableDrag = prefs.getBoolPref("extensions.confirmfmv.drag.disableDialog");
      let confirmfmvBundle = document.getElementById("bundle_confirmfmv");
      let title = confirmfmvBundle.getString("confirmMoveFolderTitle");
      let text = confirmfmvBundle.getFormattedString("confirmMoveFolderText", [dt.mozGetDataAt("text/x-moz-folder", 0).QueryInterface(Ci.nsIMsgFolder).name]);
      if (confirmFolderDrag && disableDrag)
          return false;

      // if the user says no, then just fall out
      if (confirmFolderDrag) {
          if (!promptService.confirm(window, title, text))
              return false;
      }

      for (let i = 0; i < count; i++) {
        let folders = new Array;
        folders.push(dt.mozGetDataAt("text/x-moz-folder", i)
                       .QueryInterface(Ci.nsIMsgFolder));
        let array = toXPCOMArray(folders, Ci.nsIMutableArray);
        cs.CopyFolders(array, targetFolder,
                      (folders[0].server == targetFolder.server), null,
                       msgWindow);
      }
    }
    else if (Array.indexOf(types, "text/x-moz-newsfolder") != -1) {
      // Start by getting folders into order.
      let folders = new Array;
      for (let i = 0; i < count; i++) {
        let folder = dt.mozGetDataAt("text/x-moz-newsfolder", i)
                       .QueryInterface(Ci.nsIMsgFolder);
        folders[this.getIndexOfFolder(folder)] = folder;
      }
      let newsFolder = targetFolder.rootFolder
                                   .QueryInterface(Ci.nsIMsgNewsFolder);
      // When moving down, want to insert first one last.
      // When moving up, want to insert first one first.
      let i = (aOrientation == 1) ? folders.length - 1 : 0;
      while (i >= 0 && i < folders.length) {
        let folder = folders[i];
        if (folder) {
          newsFolder.moveFolder(folder, targetFolder, aOrientation);
          this.selection.toggleSelect(this.getIndexOfFolder(folder));
        }
        i -= aOrientation;
      }
    }
    else if (Array.indexOf(types, "text/x-moz-message") != -1) {
      let array = Cc["@mozilla.org/array;1"]
                    .createInstance(Ci.nsIMutableArray);
      let sourceFolder;
      let messenger = Cc["@mozilla.org/messenger;1"].createInstance(Ci.nsIMessenger);
      for (let i = 0; i < count; i++) {
        let msgHdr = messenger.msgHdrFromURI(dt.mozGetDataAt("text/x-moz-message", i));
        if (!i)
          sourceFolder = msgHdr.folder;
        array.appendElement(msgHdr, false);
      }
      let prefBranch = Cc["@mozilla.org/preferences-service;1"]
                          .getService(Ci.nsIPrefService).getBranch("mail.");
      let isMove = Cc["@mozilla.org/widget/dragservice;1"]
                      .getService(Ci.nsIDragService).getCurrentSession()
                      .dragAction == Ci.nsIDragService.DRAGDROP_ACTION_MOVE;

      prefBranch.setCharPref("last_msg_movecopy_target_uri", targetFolder.URI);
      prefBranch.setBoolPref("last_msg_movecopy_was_move", isMove);
      // ### ugh, so this won't work with cross-folder views. We would
      // really need to partition the messages by folder.
      cs.CopyMessages(sourceFolder, array, targetFolder, isMove, null,
                        msgWindow, true);
    }
    else if (Array.indexOf(types, "application/x-moz-file") != -1) {
      for (let i = 0; i < count; i++) {
        let extFile = dt.mozGetDataAt("application/x-moz-file", i)
                        .QueryInterface(Ci.nsIFile);
        if (extFile.isFile()) {
          let len = extFile.leafName.length;
          if (len > 4 && extFile.leafName.substr(len - 4).toLowerCase() == ".eml")
            cs.CopyFileMessage(extFile, targetFolder, null, false, 1, "", null, msgWindow);
        }
      }
    }
    else if (Array.indexOf(types, "text/x-moz-url") != -1) {
      // This is a potential rss feed to subscribe to
      // and there's only one, so just get the 0th element.
      let url = dt.mozGetDataAt("text/x-moz-url", 0);
      let uri = Cc["@mozilla.org/network/io-service;1"]
                   .getService(Ci.nsIIOService).newURI(url, null, null);
      if (!(uri.schemeIs("http") || uri.schemeIs("https")) ||
             targetFolder.server.type != "rss")
        return;

      Cc["@mozilla.org/newsblog-feed-downloader;1"]
         .getService(Ci.nsINewsBlogFeedDownloader)
         .subscribeToFeed(url, targetFolder, msgWindow);
    }
};
