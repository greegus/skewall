$(function() {
  var containerElement = $('#container');
  var dropzoneElement = $('#dropzone');
  var appElement = $('#app');
  
  var container = new Transformable(containerElement);

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

  function createVideoElement(url) {
    return $('<video>').attr({
      src: url,
      autoplay: true,
      loop: true,
      controls: true,
    });
  }

  function createImageElement(url) {
    return $('<img>').attr({
      src: url,
    });
  }

  function createYoutubeEmbed(url) {
    return $('<iframe>').attr({
      width: containerElement.outerWidth(),
      height: containerElement.outerHeight(),
      src: url
    });
  }

  function handleFiles(files) {
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

      if (rule.extensions.indexOf(extension) > -1) {
        element = rule.handler(URL.createObjectURL(file));
      }
    })

    if (element)
      containerElement.empty().append(element);
  }

  makeDropZone(appElement, handleFiles);

  $('#reset-button').click(() => {
    container.reset()
  })

  $('#file-input').change((e) => {
    var files = jQuery.makeArray(e.target.files);

    if (files.length)
      handleFiles(files);

    e.target.files = null;
  })

  $('#embed-youtube').click(() => {
    var inputUrl = prompt('Youtube video URL').trim();
    debugger;
    var youtubeId = (/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/.exec(inputUrl) || [])[1] || null;
    
    if (!youtubeId)
      return;

    var url = 'https://www.youtube.com/embed/' + youtubeId;
      
    var element = createYoutubeEmbed(url);

    containerElement.empty().append(element);
  })

});