(function () {
  var script = document.currentScript || document.querySelector('script[data-calendar]');
  if (!script) return;
  var calendar = script.getAttribute('data-calendar');
  if (!calendar) return;

  // Derive base URL from the script's own src so it works in dev + prod
  var src = script.src || '';
  var base = src ? src.replace(/\/embed\.js.*$/, '') : 'https://cronva.app';

  var iframe = document.createElement('iframe');
  iframe.src = base + '/embed/' + calendar;
  iframe.title = 'Cronva Calendar Widget';
  iframe.width = '100%';
  iframe.height = '280';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('scrolling', 'no');
  iframe.style.cssText = 'border:none;border-radius:12px;overflow:hidden;max-width:100%;';

  script.parentNode.insertBefore(iframe, script.nextSibling);
})();
