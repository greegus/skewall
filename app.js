$(function() {
  var containerElement = $('#container');
  var dropzoneElement = $('#dropzone');
  var appElement = $('#app');

  function preventDrop(element) {
    $(element).on({
      dragenter: (e) => e.preventDefault(),
      dragleave: (e) => e.preventDefault(),
      dragover: (e) => e.preventDefault(),
      drop: (e) => e.preventDefault(),
    });
  }

  function makeDropZone(element, callback) {
      $(element).on({
        dragenter: (e) => e.preventDefault(),
        
        dragleave: (e) => e.preventDefault(),
        
        dragover: (e) => {
          e.preventDefault()
          e.originalEvent.dataTransfer.dropEffect = 'copy'
        },

        drop: (e) => {
          e.preventDefault();

          var files = jQuery.makeArray(e.originalEvent.dataTransfer.files);

          if (files.length)
            callback && callback(files, e);
        }
      });
  }

  function handleFileDrop(files) {
    var url = URL.createObjectURL(files[0]);
    
    var videoElement = $('<video>').attr({
      src: url,
      autoplay: true,
      loop: true,
      controls: true,
    });

    containerElement.empty().append(videoElement);
  }

  makeTransformable(containerElement);
  makeDropZone(dropzoneElement, handleFileDrop);
  preventDrop(appElement)

});