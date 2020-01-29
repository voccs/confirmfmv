all: confirmfmv.xpi

confirmfmv.xpi:
	rm -f $@
	zip $@ content/* skin/* locale/**/* manifest.json license.txt chrome.manifest defaults/preferences/confirmfmv-prefs.js _locales/**/*

babelzilla:
	rm -rf confirmfmv.xpi
	zip confirmfmv.xpi content/* skin/* locale/**/* manifest.json license.txt chrome.manifest defaults/preferences/confirmfmv-prefs.js _locales/**/*

# This is going to be more complex, comment out for now.
#localize:
#	rm -rf chrome/locale/*
#	wget http://www.babelzilla.org/wts/download/locale/all/replaced/5240 -O chrome/locale/locales.tar.gz
#	cd chrome/locale/; tar xzf locales.tar.gz
#	rm -rf chrome/locale/locales.tar.gz

clean:
	rm -f confirmfmv.xpi
