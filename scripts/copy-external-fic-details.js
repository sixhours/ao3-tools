{
	const url = `https://archiveofourown.org/external_works/new?url_from_external=${ encodeURIComponent( window.location.href ) }&title_from_external=${ encodeURIComponent( document.title ) }`;
	window.open( url, 'AO3ExtBk', 'location=yes,links=no,scrollbars=yes,toolbar=no,width=550,height=550' );
}