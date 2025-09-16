document.addEventListener("DOMContentLoaded", function() {
  const audio = document.createElement("audio");
  audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // رابط الصوت
  audio.autoplay = true;
  audio.loop = true; // يكرر الصوت
  audio.style.display = "none";
  document.body.appendChild(audio);

  // حل لمشكلة الحظر: تشغيل عند أول تفاعل مع المستخدم
  document.addEventListener("click", () => {
    audio.play();
  }, { once: true });
});
