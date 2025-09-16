(function(){
  // ضع هنا رابط الصورة البديلة
  const replacementUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEir8gaDSvOT627P9L9s43yQcEuVDjmJV0SG4TCrDvSG-VygfPtM4kVCjHE-w-GTJ8GBGeKnvNcSy1rQFdb8sPVWseTuq8bJXjYs5aft67JydcBVbwsMNrtYYprL0nFiWRwjzfwF9M5FhJhxT6kH3sdUdP8_y6uMM1rbDdT7WDogXn6psad3fNpgJCWZdFpj/s1600-rw/ChatGPT%20apaga%20nuestro%20cerebro.webp';

  // محدد الحاوية لمقال بلوجر (عدل لو قالبك مختلف)
  const containerSelector = '.post-body';

  // سمات lazy الشائعة التي يمكن أن تحمل رابط الصورة الأصل
  const lazyAttrs = ['data-src','data-lazy-src','data-original','data-srcset','data-lazy'];

  function replaceImgElement(img) {
    try {
      // لا نغير لو تبدو الصورة بالفعل مستبدلة
      if (!img || img.getAttribute('data-replaced-by-credit')) return;
      // استبدال src و currentSrc
      if (img.src !== replacementUrl) img.src = replacementUrl;
      // إزالة srcset لتجنب تحميل نسخ أصلية
      if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
      // إزالة أو استبدال سمات lazy الشائعة
      lazyAttrs.forEach(a => { if (img.hasAttribute(a)) img.removeAttribute(a); });
      // علامة لمنع تكرار العملية
      img.setAttribute('data-replaced-by-credit','1');
    } catch(e){}
  }

  function replaceInContainer() {
    const container = document.querySelector(containerSelector);
    if (!container) return 0;
    const imgs = Array.from(container.querySelectorAll('img'));
    imgs.forEach(replaceImgElement);
    return imgs.length;
  }

  // تشغيل أولي
  replaceInContainer();

  // راقب DOM لفترة قصيرة لتغطية الصور التي تُحمّل لاحقًا (مثلاً lazy load)
  const observer = new MutationObserver(() => {
    replaceInContainer();
  });
  observer.observe(document.documentElement || document.body, { childList:true, subtree:true });
  // توقف عن المراقبة بعد 10 ثواني لتقليل الاستهلاك
  setTimeout(() => observer.disconnect(), 10000);

  // واجهة بسيطة لفحص/تشغيل من Console
  try {
    window.__simpleImgReplace = {
      run: replaceInContainer,
      config: { containerSelector, replacementUrl }
    };
  } catch(e){}
})();
