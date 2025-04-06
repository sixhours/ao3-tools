/**
 * @file check-fic-stats.js
 * @description This script checks for changes in the statistics of fics on AO3 and updates the IndexedDB accordingly.
 */
{
	const databaseName = 'ao3StatsDB';
	const objectStoreName = 'ao3FicStats';

	const checkFicStats = function() {
		let messageContainer = document.querySelector( '#ao3-tools-messages' );
		// Create message container if it doesn't exist.
		if ( messageContainer ) {
			messageContainer.remove();
		}
		messageContainer = createMessageContainer();
		document.body.prepend( messageContainer );

		const request = indexedDB.open( databaseName, 1 );
		request.onerror = function( event ) {
			console.log( 'Database error: ', event.target.logCode );
			return;
		};

		request.onupgradeneeded = function( event ) {
			const db = event.target.result;
			if ( ! db.objectStoreNames.contains( objectStoreName ) ) {
				const objectStore = db.createObjectStore( objectStoreName, { keyPath: 'title', autoIncrement: false } );
				objectStore.createIndex( 'title', 'title', { unique: false } );
				objectStore.createIndex( 'subscriptions', 'subscriptions', { unique: false } );
				objectStore.createIndex( 'bookmarks', 'bookmarks', { unique: false } );
				objectStore.createIndex( 'hits', 'hits', { unique: false } );
				console.log( `Object store ${ objectStoreName } created.` );
			}
		}

		request.onsuccess = function( event ) {
			const db = request.result;
			if ( ! db || ! db.objectStoreNames.contains( objectStoreName ) ) {
				console.log( 'Database not initialized.' );
				return;
			}

			const transaction = db.transaction( objectStoreName, 'readwrite' );
			const objectStore = transaction.objectStore( objectStoreName );

			if ( ! objectStore ) {
				console.log( 'Object store not found.' );
				return;
			}

			// Get all fics on the page.
			let fics = document.querySelectorAll( '.statistics .fandom .index.group li' );
			if ( ! fics || fics.length === 0 ) {
				console.log( 'No fics found to update.' );
				return;
			}

			fics.forEach( ( fic ) => {
				const title = fic.querySelector( 'dt a' )?.textContent;
				if ( ! title ) {
					console.log( 'No title found for fic.' );
					return;
				}
				const url = fic.querySelector( 'dt a' )?.href;
				const hits = fic.querySelector( 'dd.hits' )?.textContent.replace( /,/g, '' ) || 0;
				const bookmarks = fic.querySelector( 'dd.bookmarks' )?.textContent.replace( /,/g, '' ) || 0;
				const subscriptions = fic.querySelector( 'dd.subscriptions' )?.textContent.replace( /,/g, '' ) || 0;

				// Get current values as integers.
				const currentHits = parseInt( hits );
				const currentBookmarks = parseInt( bookmarks );
				const currentSubscriptions = parseInt( subscriptions );

				const dbRecord = objectStore.get( title );

				dbRecord.onsuccess = function( event ) {
					const record = event.target.result;
					if ( record ) {
						// Compare and add message if there are changes.
						if ( record.hits !== currentHits || record.bookmarks !== currentBookmarks || record.subscriptions !== currentSubscriptions ) {
							messageText = `<div><strong><a href="${ url }" target="_blank">${ title }</a>:</strong><ul>`;

							if ( record.hits !== currentHits ) {
								messageText += `<li>${ currentHits - record.hits } new hit${
									( currentHits - record.hits ) !== 1 ? 's' : '' }</li>`;
							}

							if ( record.bookmarks !== currentBookmarks ) {
								messageText += `<li>${ currentBookmarks - record.bookmarks } new <a href="${ url }/bookmarks" target="_blank">bookmark${ 
									( currentBookmarks - record.bookmarks ) !== 1 ? 's' : '' }</a></li>`;
							}

							if ( record.subscriptions !== currentSubscriptions ) {
								messageText += `<li>${ currentSubscriptions - record.subscriptions } new subscription${
									( currentSubscriptions - record.subscriptions ) !== 1 ? 's' : '' }</a></li>`;
							}

							messageText += '</ul></div>';

							const message = createMessage( messageText, true );
							messageContainer.appendChild( message );
						}
					}

					// Update the database with new values
					setFicStats( title, currentSubscriptions, currentBookmarks, currentHits )
						.catch( ( error ) => console.log( error ) );
				};
				dbRecord.onerror = function( event ) {
					console.log( 'Error reading record: ', event.target.logCode );
				};
			} );

			function setFicStats( title, subscriptions, bookmarks, hits ) {
				const db = request.result;
				if ( ! db || ! db.objectStoreNames.contains( objectStoreName ) ) {
					console.log( 'Database not initialized.' );
					return Promise.reject( 'Database not initialized' );
				}

				const transaction = db.transaction( objectStoreName, 'readwrite' );
				const objectStore = transaction.objectStore( objectStoreName );

				const data = {
					title: title,
					subscriptions: subscriptions,
					bookmarks: bookmarks,
					hits: hits
				};

				return new Promise( ( resolve, reject ) => {
					const request = objectStore.put( data );

					request.onsuccess = function() {
						resolve();
					}

					request.onerror = function( event ) {
						reject( `Error updating stats for "${ title }": ${ event.target.logCode }` );
					};
				} );
			}
		}
	}

	checkFicStats();
}
