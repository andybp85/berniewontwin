//main.js
/* global jQuery: false */
/* global picoModal: false */
'use strict';

function privacy(){
        picoModal('Your zipcode is needed to determine you demographic and location so we can get a better idea of where Bernie\'s support lies. Your e-mail address is so that we can occassionally send you updates on the movement, the site and how you can get involved. Your name is so we can help show that Bernie\'s support is real. None of your information will ever be sold or provided to a third party. We are in no way affiliated with Bernie Sanders 2016 Official campaign for presidency, we are simply inspired by his message and want to help perpetuate it through as many means necessary. There may come a time where this information will be shared with Bernie\'s official campaign but there are currently no talks or negotations to do so. -BWW15').show();
}

function voteResults(msg){
        picoModal(msg).show();
}


jQuery(function($){

  document.getElementsByClassName('help-block')[0].addEventListener('click', privacy);


  $.localScroll({filter:'.smoothScroll'}); 

  $.get('http://berniewontwin.org/signers.php', function(data){
    $('#votes-counter')
      .text(data)
      .addClass('counter counter-analog')
      .counter({
        initial: '0000',
        direction: 'up',
        format: '9999',
        interval: 1,
        stop: data
      });

  });

  $('#vote-form button#submit').click(function(e){
      e.preventDefault(); // disable the POST of the form by the submit button
        $.ajax({
          type: 'POST',
          url: 'http://berniewontwin.org/signers.php',
          data: $('#vote-form').serialize(),
          success: voteResults,
          error: voteResults
        });
  });

});
