(function(){
  const CONFIG = {
    headerSelector: 'header, .site-header, #header, .main-header', // سيأخذ أول مطابق
    imageUrl: 'https://www.aljazeera.com/wp-content/uploads/2025/09/AFP__20250913__74D42T4__v1__HighRes__PalestinainIsraelConflict-1757785947.jpg', // رابط صورتك هنا
    imageAlt: 'إعلان',                                            // نص بديل
    imageLink: '',                                                // لو تريد ربط الصورة ضع رابط، وإلا اترك ''
    openInNewTab: true,                                           // فتح الرابط في تبويب جديد؟
    maxWidth: '1000px',                                           // أقصى عرض للبانر
    marginTop: '8px',
    marginBottom: '18px',
    insertPosition: 'after', /* 'after' | 'before' | 'prepend' | 'append' */
    dataAttr: 'data-injected-banner-by-creditjs',
    observeTimeout: 4000 //ms — مدة المراقبة لإيجاد الهيدر لو حمل متأخرا
  };

  // إدراج قواعد CSS أساسية للبانر
  function injectStyles() {
    if (document.getElementById('creditjs-banner-style')) return;
    const css = 
      .creditjs-banner-wrapper { box-sizing:border-box; margin:0 auto; text-align:center; }
      .creditjs-banner-wrapper img { max-width:100%; height:auto; display:block; margin:0 auto; border-radius:6px; }
      .creditjs-banner-wrapper a { display:inline-block; line-height:0; }
      @media (max-width:600px) { .creditjs-banner-wrapper { padding:0 8px; } }
    ;
    const s = document.createElement('style');
    s.id = 'creditjs-banner-style';
    s.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(s);
  }

  // بناء عنصر البانر
  function buildBanner() {
    const wrapper = document.createElement('div');
    wrapper.className = 'creditjs-banner-wrapper';
    wrapper.setAttribute(CONFIG.dataAttr, '1');
    wrapper.style.maxWidth = CONFIG.maxWidth || '';
    wrapper.style.marginTop = CONFIG.marginTop || '';
    wrapper.style.marginBottom = CONFIG.marginBottom || '';

    const img = document.createElement('img');
    img.src = CONFIG.imageUrl;
    img.alt = CONFIG.imageAlt || '';

    if (CONFIG.imageLink) {
      const a = document.createElement('a');
      a.href = CONFIG.imageLink;
      if (CONFIG.openInNewTab) a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.appendChild(img);
      wrapper.appendChild(a);
    } else {
      wrapper.appendChild(img);
    }
    return wrapper;
  }

  // ايجاد الهيدر عبر قائمة سيلكتور
  function findHeader() {
    const sels = CONFIG.headerSelector.split(',').map(s=>s.trim()).filter(Boolean);
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  // إدراج البانر بحسب المكان
  function insertBannerAt(headerEl, bannerEl) {
    if (!headerEl || !bannerEl) return false;
    // منع التكرار
    if (headerEl.parentNode && headerEl.parentNode.querySelector && headerEl.parentNode.querySelector('['+CONFIG.dataAttr+']')) return false;
    switch (CONFIG.insertPosition) {
      case 'before':
        headerEl.parentNode && headerEl.parentNode.insertBefore(bannerEl, headerEl);
        break;
      case 'prepend':
        headerEl.insertBefore(bannerEl, headerEl.firstChild);
        break;
      case 'append':
        headerEl.appendChild(bannerEl);
        break;
      case 'after':
      default:
        if (headerEl.nextSibling) headerEl.parentNode.insertBefore(bannerEl, headerEl.nextSibling);
        else headerEl.parentNode.appendChild(bannerEl);
    }
    return true;
  }

  // التنفيذ الرئيسي: محاولة وضع البانر فوراً ثم مراقبة لعدة ثواني لو الهيدر لم يظهر بعد
  function run() {
    injectStyles();
    const banner = buildBanner();
    const header = findHeader();
    if (header) {
      insertBannerAt(header, banner);
      return;
    }

    // لو لم يوجد الهيدر بعد (قالب ديناميكي)، راقب DOM لوقت قصير

let observer;
    const start = Date.now();
    observer = new MutationObserver(() => {
      if (Date.now() - start > CONFIG.observeTimeout) { observer.disconnect(); return; }
      const h = findHeader();
      if (h) {
        insertBannerAt(h, banner);
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement || document.body, { childList:true, subtree:true });
    setTimeout(()=> observer.disconnect(), CONFIG.observeTimeout + 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

})();
