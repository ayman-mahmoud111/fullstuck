// Minimal JS: lazy load images, lightbox, play/pause music, reveal on scroll
document.addEventListener('DOMContentLoaded',()=>{
  // Password Protection
  const correctPassword = '123456';
  const passwordModal = document.getElementById('passwordModal');
  const passwordInput = document.getElementById('passwordInput');
  const errorMessage = document.getElementById('errorMessage');
  
  // Check if already unlocked in this session
  if(!sessionStorage.getItem('siteUnlocked')){
    // Keep password modal visible until correct password is entered
    document.body.style.overflow = 'hidden';
    passwordInput.focus();
  } else {
    // Already unlocked, hide modal
    passwordModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  
  window.checkPassword = function(){
    const entered = passwordInput.value.trim();
    if(entered === correctPassword){
      sessionStorage.setItem('siteUnlocked', 'true');
      errorMessage.textContent = '';
      passwordModal.classList.add('hidden');
      document.body.style.overflow = '';
      passwordInput.value = '';
    } else {
      errorMessage.textContent = 'كلمة المرور غير صحيحة ❌';
      passwordInput.value = '';
      passwordInput.focus();
    }
  };

  // Lazy load images
  const lazy = document.querySelectorAll('img.lazy');
  const obs = new IntersectionObserver((entries,ob)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const img = e.target; img.src = img.dataset.src; img.classList.remove('lazy'); ob.unobserve(img);
      }
    })
  },{root:null,threshold:0.05,rootMargin:'0px 0px 120px 0px'});
  lazy.forEach(i=>obs.observe(i));

  // Lightbox (minimal, centered)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  document.querySelectorAll('.gallery-item').forEach(img=>{
    img.addEventListener('click',()=>{
      lightboxImg.src = img.src || img.dataset.src;
      lightbox.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    })
  });
  lightbox.querySelector('.close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click',(e)=>{ if(e.target===lightbox) closeLightbox(); });
  function closeLightbox(){ lightbox.setAttribute('aria-hidden','true'); lightboxImg.src=''; document.body.style.overflow=''; }

  // Play / Pause music (respect reduced motion)
  const music = document.getElementById('bg-music');
  const playBtn = document.getElementById('playMusic');
  const playBtnHero = document.getElementById('playMusicHero');
  const toggleMusic = (btn) => {
    if(music.paused){ 
      music.play().catch(()=>{}); 
      if(playBtn) playBtn.textContent='إيقاف الموسيقى'; 
      if(playBtnHero) playBtnHero.textContent='⏸ إيقاف الموسيقى'; 
    }
    else { 
      music.pause(); 
      if(playBtn) playBtn.textContent='تشغيل الموسيقى'; 
      if(playBtnHero) playBtnHero.textContent='♫ شغّل الموسيقى'; 
    }
  };
  if(playBtn){
    playBtn.addEventListener('click', () => toggleMusic(playBtn));
  }
  if(playBtnHero){
    playBtnHero.addEventListener('click', () => toggleMusic(playBtnHero));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  // Reveal on scroll, slow and subtle
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal, .section-title, .letter, .gallery-grid, .videos-grid, .timeline');
  const rObs = new IntersectionObserver((entries,ob)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        if(!prefersReduced) ent.target.classList.add('visible');
        else ent.target.classList.add('visible');
        ob.unobserve(ent.target);
      }
    })
  },{threshold:0.06,rootMargin:'0px 0px -8% 0px'});
  reveals.forEach(r=>rObs.observe(r));
});
