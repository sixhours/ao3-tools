function fadeMessage( message ) {
	setTimeout( () => {
		if ( message ) {
			message.style.opacity = '0';
			message.style.transition = 'opacity 0.5s ease-out';
			setTimeout( () => {
				message.remove();
			}, 500 );
		}
	}, 3000 );
}

function createMessage( content, showClose = true ) {
	const message = document.createElement( 'div' );
	message.innerHTML = content;
	message.className = 'ao3-tools-message';
	
	if ( showClose ) {
		const closeButton = document.createElement( 'button' );
		closeButton.textContent = '×';
		closeButton.onclick = fadeMessage.bind( null, message );
		message.appendChild( closeButton );
	}

	return message;
}

function createMessageContainer() {
	const messageContainer = document.createElement( 'div' );
	messageContainer.id = 'ao3-tools-messages';
	return messageContainer;
}
