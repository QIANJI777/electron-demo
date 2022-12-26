import { debounce } from 'lodash'
(function(doc, win) {
  const docEl = doc.documentElement;
  const recalc = function() {
    const clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    console.log(clientWidth)
    if (clientWidth >= 1920) {
      docEl.style.fontSize = '16px';
    } else {
      docEl.style.fontSize = 16 * (clientWidth / 1920) + 'px';
    }
  };

  if (!doc.addEventListener) return;
  win.addEventListener('resize', debounce(recalc, 100), false);

  doc.addEventListener('DOMContentLoaded', recalc, false);
  /* DOMContentLoaded文档加载完成不包含图片资源 onload包含图片资源*/
})(document, window);

