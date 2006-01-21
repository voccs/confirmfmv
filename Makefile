all: confirmfmv.xpi

confirmfmv.xpi:
	make -f Makefile.chrome -C chrome confirmfmv.jar
	rm -f $@
	zip $@ chrome/confirmfmv.jar install.js install.rdf license.txt chrome.manifest defaults/preferences/confirmfmv-prefs.js 

clean:
	rm -f chrome/confirmfmv.jar confirmfmv.xpi
