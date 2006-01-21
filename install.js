const APP_DISPLAY_NAME = "Confirm Folder Move";
const APP_NAME = "confirmfmv";
const APP_PACKAGE = "confirmfmv";
const APP_VERSION = "0.1";

const APP_JAR_FILE = APP_NAME+".jar";
initInstall(APP_NAME, APP_PACKAGE, APP_VERSION);

var prefDir = getFolder("Program", "defaults/pref");
var err = addFile(APP_NAME, 'defaults/preferences/confirmfmv-prefs.js', prefDir, null);

if (err == SUCCESS) {
	var chromef = getFolder("Profile", "chrome");
	err = addFile(APP_PACKAGE, APP_VERSION, 'chrome/'+APP_JAR_FILE, chromef, null);

	if(err == SUCCESS) {
		var jar = getFolder(chromef, APP_JAR_FILE);
		registerChrome(CONTENT | PROFILE_CHROME, jar, 'content/');
		registerChrome(LOCALE | PROFILE_CHROME, jar, 'locale/en-US/');
		registerChrome(SKIN | PROFILE_CHROME, jar, 'skin/classic/confirmfmv/');

		err = performInstall();
		if(err == SUCCESS || err == 999) {
			alert(APP_NAME + " " + APP_VERSION + " has been succesfully installed.\n"
				+"Please restart your browser before continuing.");
		} else {
			alert("Install failed. Error code:" + err);
			cancelInstall(err);
		}

	} else {
		alert("Failed to create " +APP_JAR_FILE +"\n"
			+"You probably don't have appropriate permissions \n"
			+"(write access to mozilla/chrome directory). \n"
			+"_____________________________\nError code:" + err);
		cancelInstall(err);
	}
} else {
	alert("Failed to create confirmfmv-prefs.js\n"
		+"You probably don't have appropriate permissions \n"
		+"(write access to mozilla/defaults/pref directory). \n"
		+"_____________________________\nError code:" + err);
	cancelInstall(err);
}

