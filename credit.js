(function(){
  const imgUrl = "https://via.placeholder.com/300x200"; // رابط الصورة
  const linkUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6BdC3ee8auf2I5eSkxwgA0p6ewhsbvIinEg&s";                // الرابط عند الضغط
  const position = "right";                             // "right" أو "left"

  document.addEventListener("DOMContentLoaded", function() {
    // أنشئ العنصر
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.bottom = "20px";
    wrapper.style[position] = "20px";
    wrapper.style.width = "300px";
    wrapper.style.height = "200px";
    wrapper.style.zIndex = "9999";
    wrapper.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
    wrapper.style.borderRadius = "8px";
    wrapper.style.overflow = "hidden";
    wrapper.style.background = "#fff";

    // صورة
    const img = document.createElement("img");
    img.src = imgUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    // لو فيه رابط
    if (linkUrl) {
      const a = document.createElement("a");
      a.href = linkUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.appendChild(img);
      wrapper.appendChild(a);
    } else {
      wrapper.appendChild(img);
    }

    document.body.appendChild(wrapper);
  });
})();
