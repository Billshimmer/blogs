(function() {
  var logDiv;
  window._weblog = function(msg) {
    if (!logDiv) {
      logDiv = document.createElement('pre');
      logDiv.style = 'height: 150px; overflow-y: auto; background-color: #fff; position: absolute; bottom: 0; left: 0; right: 0; z-index: 999; margin: 0;';
      document.body.appendChild(logDiv);
    }
    logDiv.innerText += msg + '\n';
  };
})();
