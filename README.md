ConfirmFolderMove
=================

This is a Thunderbird add-on for confirming folder movement to avoid the pain of accidentally shifting an enormous IMAP folder out of place and the consequences of waiting for it to complete before correcting the mistake.

You should acquire it from [addons.mozilla.org](https://addons.mozilla.org/thunderbird/addon/confirmfoldermove/).  Thanks to the hard work and commitment of folks at [BabelZilla](http://www.babelzilla.org/), the add-on is available in a wide variety of localizations.

Development
-----------

This is a Make based project.  There are two main targets, one builds the XPI appropriate for deployment (`all`), the other builds an XPI for translation for upload to BabelZilla (`babelzilla`), which includes strings that are used in the `install.rdf` and addons.mozilla.org and consequently sit outside the normal flow of translation.

I consider this add-on feature complete.

Mechanism
---------

Inspection of the source should reveal that this patches one method usually found in `chrome://messenger/content/folderPane.js`, `gFolderTreeView.drop`.

If anybody can help me get this committed to the actual Thunderbird code base so the add-on is no longer necessary, please let me know.

Contributors
------------

Thank you to the following for their code contributions to the extension:

 * [Manuel Rüger](https://github.com/mrueg)


Translators
-----------

With the change from `install.rdf` to `manifest.json`, I'm no longer able to credit translators directly in the extension metadata, so this list will have to suffice for now. Many thanks for the translation work freely given by:

 * Marcelo Ghelman (ghelman.net)
 * Edvard Borovskij
 * Carlos Simão
 * ДакСРБИЈА
 * Luana Di Muzio - BabelZilla
 * Володимир Савчук Volodymyr Savchuk
 * yfdyh000 (yfdyh000@gmail.com)
 * Mikael Hiort af Ornäs

Migration
---------

* [x] Finish moving whatever can be moved to _locales messages.json files.
* [x] Figure out whether former stringbundle properties can be folded correctly into _locale messages.json with browser.i18n - yes. Convert to this.
* [x] Figure out how to overlay since that seems to be absent from chrome.manifest now - nope, the old system no longer recognizes it, but the new overlay loader converts them to something it will use.
* [x] Apparently nope, break the properties back out of the messages.json and just ditch most of the _locales.  The bit we're overriding doesn't make use of browser.i18n and has to use string bundles loaded from the chrome URL.
* [?] Figure out where to put default preference values.  Leave them where they are, I think.
* [x] Make sure the build builds properly (see whatever path folderflags took to get there).
* [x] Test it out in TB68.
* [ ] Make sure the options panel works correctly, adapt if not.  It doesn't register, unclear what's going on.  Maybe bad XUL.
* [ ] Redo CSS styles.
