// This is cribbed from comm/mail/base/content/folderPane.js
window.gFolderTreeView.drop = function ftv_drop(aRow, aOrientation) {
  let targetFolder = window.gFolderTreeView._rowMap[aRow]._folder;

  let dt = this._currentTransfer;
  let count = dt.mozItemCount;
  let cs = MailServices.copy;

  // This is a potential rss feed.  A link image as well as link text url
  // should be handled; try to extract a url from non moz apps as well.
  let feedUri =
    targetFolder.server.type == "rss" && count == 1
      ? FeedUtils.getFeedUriFromDataTransfer(dt)
      : null;

  // we only support drag of a single flavor at a time.
  let types = Array.from(dt.mozTypesAt(0));
  if (types.includes("text/x-moz-folder")) {
    // BEGIN CHANGES
    // Moving folders is annoying if that's not actually what
    // somebody wanted to do.  So ASK FIRST.

    // get folder dragging pref
    let cfmPref = Services.prefs.getBranch("extensions.confirmfmv.drag.");
    let confirmFolderDrag = cfmPref.getBoolPref("confirm");
    let disableDrag = cfmPref.getBoolPref("disableDialog");
    let cfmBundle = Services.strings.createBundle("chrome://confirmfmv/locale/confirmfmv.properties")
    let title = cfmBundle.GetStringFromName("confirmMoveFolderTitle");
    let text = cfmBundle.formatStringFromName("confirmMoveFolderText", [
      dt
        .mozGetDataAt("text/x-moz-folder", 0)
        .QueryInterface(Ci.nsIMsgFolder).name
    ], 1);
    if (confirmFolderDrag && disableDrag)
      return false;

    // if the user says no, then just fall out
    if (confirmFolderDrag) {
      let promptService =
        Cc["@mozilla.org/embedcomp/prompt-service;1"]
          .getService(Ci.nsIPromptService);
      if (!promptService.confirm(window, title, text))
        return false;
    }
    // END CHANGES

    for (let i = 0; i < count; i++) {
      let folders = [];
      folders.push(
        dt
          .mozGetDataAt("text/x-moz-folder", i)
          .QueryInterface(Ci.nsIMsgFolder)
      );
      let array = toXPCOMArray(folders, Ci.nsIMutableArray);
      cs.CopyFolders(
        array,
        targetFolder,
        folders[0].server == targetFolder.server,
        null,
        msgWindow
      );
    }
  } else if (types.includes("text/x-moz-newsfolder")) {
    // Start by getting folders into order.
    let folders = [];
    for (let i = 0; i < count; i++) {
      let folder = dt
        .mozGetDataAt("text/x-moz-newsfolder", i)
        .QueryInterface(Ci.nsIMsgFolder);
      folders[this.getIndexOfFolder(folder)] = folder;
    }
    let newsFolder = targetFolder.rootFolder.QueryInterface(
      Ci.nsIMsgNewsFolder
    );
    // When moving down, want to insert first one last.
    // When moving up, want to insert first one first.
    let i = aOrientation == 1 ? folders.length - 1 : 0;
    while (i >= 0 && i < folders.length) {
      let folder = folders[i];
      if (folder) {
        newsFolder.moveFolder(folder, targetFolder, aOrientation);
        this.selection.toggleSelect(this.getIndexOfFolder(folder));
      }
      i -= aOrientation;
    }
  } else if (types.includes("text/x-moz-message")) {
    let array = Cc["@mozilla.org/array;1"].createInstance(Ci.nsIMutableArray);
    let sourceFolder;
    let messenger = Cc["@mozilla.org/messenger;1"].createInstance(
      Ci.nsIMessenger
    );
    for (let i = 0; i < count; i++) {
      let msgHdr = messenger.msgHdrFromURI(
        dt.mozGetDataAt("text/x-moz-message", i)
      );
      if (!i) {
        sourceFolder = msgHdr.folder;
      }
      array.appendElement(msgHdr);
    }
    let prefBranch = Services.prefs.getBranch("mail.");
    let isMove =
      Cc["@mozilla.org/widget/dragservice;1"]
        .getService(Ci.nsIDragService)
        .getCurrentSession().dragAction ==
      Ci.nsIDragService.DRAGDROP_ACTION_MOVE;
    if (!sourceFolder.canDeleteMessages) {
      isMove = false;
    }

    prefBranch.setCharPref("last_msg_movecopy_target_uri", targetFolder.URI);
    prefBranch.setBoolPref("last_msg_movecopy_was_move", isMove);
    // ### ugh, so this won't work with cross-folder views. We would
    // really need to partition the messages by folder.
    cs.CopyMessages(
      sourceFolder,
      array,
      targetFolder,
      isMove,
      null,
      msgWindow,
      true
    );
  } else if (feedUri) {
    Cc["@mozilla.org/newsblog-feed-downloader;1"]
      .getService(Ci.nsINewsBlogFeedDownloader)
      .subscribeToFeed(feedUri.spec, targetFolder, msgWindow);
  } else if (types.includes("application/x-moz-file")) {
    for (let i = 0; i < count; i++) {
      let extFile = dt
        .mozGetDataAt("application/x-moz-file", i)
        .QueryInterface(Ci.nsIFile);
      if (extFile.isFile()) {
        let len = extFile.leafName.length;
        if (len > 4 && extFile.leafName.toLowerCase().endsWith(".eml")) {
          cs.CopyFileMessage(
            extFile,
            targetFolder,
            null,
            false,
            1,
            "",
            null,
            msgWindow
          );
        }
      }
    }
  }
}
