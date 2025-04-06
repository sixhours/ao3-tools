const ao3Prefix = 'https://archiveofourown.org/';
const ao3SingleFic = ao3Prefix + 'works/';
const ao3Stats = ao3Prefix + 'users/';

chrome.action.onClicked.addListener( ( tab ) => {
	if ( tab.url.startsWith( ao3SingleFic ) ) {
		chrome.scripting.executeScript( {
			files: [ 'copy-fic-details.js' ],
			target: { tabId: tab.id },
		} );
	} else if ( tab.url.startsWith( ao3Stats ) ) {
		chrome.scripting.executeScript( {
			files: [ 'check-fic-stats.js' ],
			target: { tabId: tab.id },
		} );
	} else {
		chrome.scripting.executeScript( {
			files: [ 'copy-external-fic-details.js' ],
			target: { tabId: tab.id },
		} );
	}
} );

chrome.tabs.onActivated.addListener( ( tabId ) => {
	chrome.tabs.get( tabId.tabId, ( tab ) => {
		if ( ! tab || ! tab.url ) {
			return;
		}

		if ( tab.url.startsWith( ao3SingleFic ) ) {
			chrome.action.setTitle( {
				title: 'Copy Fic Details',
				tabId: tab.id,
			} );
			return;
		} else if ( tab.url.startsWith( ao3Prefix ) ) {
			chrome.action.setTitle( {
				title: 'AO3 Tools',
				tabId: tab.id,
			} );
			return;
		} else {
			chrome.action.setTitle( {
				title: 'Bookmark External Fic',
				tabId: tab.id,
			} );
		}
	} );
} );
