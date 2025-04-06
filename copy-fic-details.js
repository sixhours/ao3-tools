async function ficDeets() {
	const ficDetailsCopiedNoticeContainer = createMessageContainer();
	const ficDetailsCopiedNoticeMessage = createMessage( 'Fic details copied to clipboard!', false );
	document.body.prepend( ficDetailsCopiedNoticeContainer );

	const workNode = document.querySelector('.works-show') ? document.querySelector( '.works-show' ) : document.querySelector( '.work');
	const url = window.location.href;
	const title = workNode.querySelector( '.preface h2.title' )?.textContent.trim();
	const author = workNode.querySelector( '.preface h3.byline a' )?.textContent;
	const fandom = workNode.querySelector( '.fandom.tags a.tag:first-of-type' )?.textContent.replaceAll(/\(.+?\)/g, "").trim();
	const characterTags = workNode.querySelectorAll( 'dd.character.tags li' );
	const additionalTags = workNode.querySelectorAll( 'dd.freeform.tags li' );
	const isBookmarked = workNode.querySelector( 'a.bookmark_form_placement_open' )?.textContent === "Edit Bookmark";
	let characters = [];
	if ( characterTags ) {
		characterTags.forEach( element => {
			characters.push( element.textContent.split( "(" )[0].trim() );
		} );
	}
	const characterList = characters.join( ", " );

	let tags = [];
	if ( additionalTags && additionalTags.length > 0 ) {
		additionalTags.forEach( element => {
			tags.push( element.textContent );
		} );
	}
	
	const wordCount = workNode.querySelector( 'dd.words' )?.textContent;
	const date = new Date().toDateString();
	const row = `"${ date }"\t"${ title }"\t"${ author }"\t"${ wordCount }"\t"${ fandom }"\t"${ characterList }"\t"${ tags }"\t"${ isBookmarked ? 'Bookmarked' : '' }"\t"${ url }"\n`;
	const copied = navigator.clipboard.writeText( row );

	if ( copied ) {
		console.log( 'Fic details copied to clipboard:\n' + row );
		ficDetailsCopiedNoticeContainer.appendChild( ficDetailsCopiedNoticeMessage );
		fadeMessage( ficDetailsCopiedNoticeContainer );
	}
}
ficDeets();
