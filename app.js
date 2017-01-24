$(function() {
  var containerElement = $('#container');
  var dropzoneElement = $('#dropzone');
  var appElement = $('#app');

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

  function createVideoElement(file) {
      return $('<video>').attr({
        src: URL.createObjectURL(file),
        autoplay: true,
        loop: true,
        controls: true,
      });
  }

  function createImageElement(file) {
      return $('<img>').attr({
        src: URL.createObjectURL(file),
      });
  }

  function handleFileDrop(files) {
    var file = files[0];
    var extension = file.name.split('.').pop();
    var element;

    if (!extension)
      return;
    
    let knownExtension = [
      {
        extensions: ['jpg', 'png', 'gif', 'jpeg'],
        handler: createImageElement
      },

      {
        extensions: ['mp4', 'mov', 'avi', 'mpeg'],
        handler: createVideoElement
      },
    ]

    knownExtension.forEach((rule) => {
      if (element)
        return;

      if (rule.extensions.indexOf(extension) > -1)
        element = rule.handler(file);
    })

    if (element)
      containerElement.empty().append(element);
  }

  makeTransformable(containerElement);
  makeDropZone(appElement, handleFileDrop);

});