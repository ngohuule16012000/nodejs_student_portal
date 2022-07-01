function signOut() 
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () 
    {
    	console.log('User signed out.');
    });
};

// Emoji
$('.textareapost').emojioneArea({
	pickerPosition: 'top'
});

// //template tag
// var temp, item, a, i;
// temp = document.querySelector("#MyTemplate");
// for (i = 0; i < 10; i++) {
//   var clone = temp.content.cloneNode(true);
//   var messagetext = clone.querySelectorAll('.messagetext');
//   messagetext[0].innerHTML = "Message " + i;
//   temp.parentNode.appendChild(clone);
// }

// show image when upload in post
const imageInput = document.querySelector('#inputImage');

imageInput.addEventListener("change", function()  
{
	console.log(imageInput.value);
	let reader = new FileReader();

	reader.addEventListener("load", () => {
		const uploadedImage = reader.result;
		// document.querySelector("#showImage").style.backgroundImage = `url(${uploadedImage})`;
		document.querySelector("#showImage").src = `${uploadedImage}`;
		// document.querySelector("#inputImage").hidden = true;
	})
	console.log(this.files[0]);
	reader.readAsDataURL(this.files[0]);
})
