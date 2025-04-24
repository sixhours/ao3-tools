/**
 * @file download-fic-bookmarks.js
 * @description This script downloads the bookmarks of a user from AO3.
 */

{
	const bookmarks = document.querySelectorAll( '.bookmark h4.heading a:first-of-type' );

	const downloadUrls = [];
	bookmarks.forEach( bookmark => {
		const title = bookmark.innerText;
		const titleWithoutSpaces = title.replace( /\s+/g, '_' );
		const workUrl = bookmark.href.match( /\/works\/(\d+)/ );
		if ( workUrl ) {
			const workId = workUrl[ 1 ];
			downloadUrls.push( `https://archiveofourown.org/downloads/${ workId }/${ titleWithoutSpaces }.epub` );
		}
	} );

	downloadUrls.forEach( ( url ) => {
		window.open( url, '_blank' );
	} );
}
