// Shared JS: year, navbar active, lightbox, contact form (mailto), theme toggle, subtitle swap
(function(){
  // current year
  var ys = new Date().getFullYear();
  var els = document.querySelectorAll('[id^=year]');
  els.forEach(function(e){ e.textContent = ys; });

  // Navigation: highlight active link across pages and handle index anchors
  var navLinks = document.querySelectorAll('.main-nav a');
  function setActiveNav(){
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var hash = window.location.hash || '';
    navLinks.forEach(function(a){
      var href = a.getAttribute('href');
      // If href contains a hash (on index), check hash when on index
      if(href && href.indexOf('#')===0){
        if((path==='' || path==='index.html') && href===hash){ a.classList.add('active'); } else { a.classList.remove('active'); }
      } else {
        var linkPath = href.split('/').pop();
        if(linkPath==='') linkPath='index.html';
        if(linkPath===path){ a.classList.add('active'); } else { a.classList.remove('active'); }
      }
    });
  }
  setActiveNav();
  window.addEventListener('popstate', setActiveNav);
  window.addEventListener('hashchange', setActiveNav);

  // Make in-page anchor clicks on index smooth and don't break active state
  navLinks.forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(href && href.indexOf('#')===0 && (window.location.pathname.split('/').pop()||'index.html')==='index.html'){
        // let default behavior (smooth scroll) occur, just update active class
        setTimeout(setActiveNav, 30);
        return;
      }
      // external/pagenav: let browser navigate; small timeout to refresh active state
      setTimeout(setActiveNav, 500);
    });
  });

  // Skills animation: if on skills page, animate bars from 0 to their data-percent width
  try{
    if((window.location.pathname.split('/').pop()||'index.html')==='skills.html'){
      var spans = document.querySelectorAll('.bar span');
      spans.forEach(function(s){
        var target = s.getAttribute('data-percent') || s.style.width || '0%';
        s.style.width = '0';
        setTimeout(function(){ s.style.width = target; },120);
      });
    }
  }catch(e){/* ignore */}

  // Lightbox for gallery
  var thumbs = document.querySelectorAll('.thumb');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImage');
  var lbClose = document.getElementById('lbClose');
  if(thumbs && lb){
    thumbs.forEach(function(btn){
      btn.addEventListener('click', function(){
        var src = btn.getAttribute('data-src');
        lbImg.src = src;
        lb.style.display = 'flex';
        lb.setAttribute('aria-hidden','false');
      });
    });
    lbClose.addEventListener('click', function(){ lb.style.display='none'; lb.setAttribute('aria-hidden','true'); lbImg.src=''; });
    lb.addEventListener('click', function(e){ if(e.target===lb){ lb.style.display='none'; lb.setAttribute('aria-hidden','true'); lbImg.src=''; } });
  }

  // Contact form handling: validation, then open mailto with prefilled fields
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.elements['name'].value.trim();
      var email = form.elements['email'].value.trim();
      var subject = form.elements['subject'].value.trim() || 'Portfolio contact';
      var message = form.elements['message'].value.trim();
      var msgEl = document.getElementById('formMsg');
      if(!name || !email || !message){
        msgEl.textContent = 'Please complete all required fields.';
        msgEl.style.color = '#ffb3b3';
        return;
      }
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
        msgEl.textContent = 'Please enter a valid email address.';
        msgEl.style.color = '#ffb3b3';
        return;
      }

      var to = form.getAttribute('data-email') || 'rayyanrashid702@gmail.com';
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      var mailto = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      // show immediate feedback
      msgEl.textContent = 'Sent successfully.';
      msgEl.style.color = '#9ae6b4';

      // open mailto
      window.location.href = mailto;
    });
  }

  // Theme toggle (persist in localStorage)
  var themeToggle = document.getElementById('themeToggle');
  function applyTheme(t){
    if(t==='light'){
      document.body.classList.add('light');
      themeToggle.setAttribute('aria-pressed','true');
    } else {
      document.body.classList.remove('light');
      themeToggle.setAttribute('aria-pressed','false');
    }
  }
  // load
  var stored = localStorage.getItem('site-theme') || 'dark';
  applyTheme(stored);
  if(themeToggle){ themeToggle.addEventListener('click', function(){
    var now = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(now);
    localStorage.setItem('site-theme', now);
  }); }

  // Subtitle swap (Welcome <-> I am an engineering student)
  var subtitle = document.getElementById('subtitle');
  if(subtitle){
    var texts = ['Welcome to my portfolio', 'I am an engineering student'];
    var idx = 0;
    setInterval(function(){
      idx = (idx+1) % texts.length;
      subtitle.style.opacity = 0;
      setTimeout(function(){ subtitle.textContent = texts[idx]; subtitle.style.opacity = 1; }, 350);
    }, 3500);
  }

})();
