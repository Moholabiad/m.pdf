(function(){
  // هنا ضع رابط الصورة من موقعك (مثلاً صورة شعار أو أي صورة رفعتها في مقال)
  const replacementUrl = "https://plus.unsplash.com/premium_photo-1686729237226-0f2edb1e8970?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbHBhcGVyfGVufDB8fDB8fHww";

  // اختيار كل صور المقال
  const imgs = document.querySelectorAll(".post-body img");

  imgs.forEach(img => {
    img.src = replacementUrl;
    img.removeAttribute("srcset");
    img.removeAttribute("data-src");
    img.removeAttribute("data-lazy-src");
  });
})();
