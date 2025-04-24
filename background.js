const ao3Prefix = new RegExp( /^https:\/\/archiveofourown.org\//, 'gm' );
const ao3SingleFic = new RegExp( /^https:\/\/archiveofourown.org\/works\/[0-9]+\/chapters\/[0-9]+/, 'gm' );
const ao3Bookmarks = new RegExp( /^https:\/\/archiveofourown.org\/users\/[a-zA-Z0-9_]+\/bookmarks/, 'gm' );
const ao3Stats = new RegExp( /^https:\/\/archiveofourown.org\/users\/[a-zA-Z0-9_]+\/stats/, 'gm' );

chrome.action.onClicked.addListener( ( tab ) => {
	if ( tab.url.match( ao3Prefix ) ) {
		chrome.scripting.executeScript( {
			files: [ 'scripts/helpers.js' ],
			target: { tabId: tab.id },
		} );
	}
	if ( tab.url.match( ao3SingleFic ) ) {
		chrome.scripting.executeScript( {
			files: [ 'scripts/copy-fic-details.js' ],
			target: { tabId: tab.id },
		} );
	} else if ( tab.url.match( ao3Stats ) ) {
		chrome.scripting.executeScript( {
			files: [ 'scripts/check-fic-stats.js' ],
			target: { tabId: tab.id },
		} );
	} else if ( tab.url.match( ao3Bookmarks ) ) {
		chrome.scripting.executeScript( {
			files: [ 'scripts/download-fic-bookmarks.js' ],
			target: { tabId: tab.id },
		} );
	} else {
		chrome.scripting.executeScript( {
			files: [ 'scripts/copy-external-fic-details.js' ],
			target: { tabId: tab.id },
		} );
	}
} );
