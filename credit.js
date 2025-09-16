(function(){
  // ضع رابط الصورة من أي موقع خارجي
  const imageUrl = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d";

  document.addEventListener("DOMContentLoaded", function() {
    // مسح كل محتوى الصفحة
    document.body.innerHTML = "";

    // إنشاء العنصر
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "صورة";
    img.style.display = "block";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.margin = "0 auto";

    // إضافته للصفحة
    document.body.appendChild(img);

    // تنسيق الوسط
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";
    document.body.style.background = "#fff";
  });
})();
