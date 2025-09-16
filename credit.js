(function(){
  // هنا ضع رابط الصورة من موقعك (مثلاً صورة شعار أو أي صورة رفعتها في مقال)
  const replacementUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEir8gaDSvOT627P9L9s43yQcEuVDjmJV0SG4TCrDvSG-VygfPtM4kVCjHE-w-GTJ8GBGeKnvNcSy1rQFdb8sPVWseTuq8bJXjYs5aft67JydcBVbwsMNrtYYprL0nFiWRwjzfwF9M5FhJhxT6kH3sdUdP8_y6uMM1rbDdT7WDogXn6psad3fNpgJCWZdFpj/s1600-rw/ChatGPT%20apaga%20nuestro%20cerebro.webp";

  // اختيار كل صور المقال
  const imgs = document.querySelectorAll(".post-body img");

  imgs.forEach(img => {
    img.src = replacementUrl;
    img.removeAttribute("srcset");
    img.removeAttribute("data-src");
    img.removeAttribute("data-lazy-src");
  });
})();
