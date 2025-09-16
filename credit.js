(function(){
  const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // غيّر للرابط اللي تريده

  document.addEventListener("DOMContentLoaded", function() {
    document.body.innerHTML = "";

    const video = document.createElement("video");
    video.src = videoUrl;
    video.controls = true;   // لإظهار أزرار التشغيل
    video.autoplay = true;   // يبدأ تلقائيًا
    video.loop = true;       // يعيد التشغيل
    video.style.maxWidth = "100%";
    video.style.height = "auto";

    document.body.appendChild(video);

    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.height = "100vh";
    document.body.style.margin = "0";
    document.body.style.background = "#000";
  });
})();
