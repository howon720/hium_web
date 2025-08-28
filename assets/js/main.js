jQuery(window).on('load', function() {
	"use strict";
    
    
    // HIDE PRELOADER
    $(".preloader").addClass("hide-preloader");   
    
    // SHOW/ANIMATE ANIMATION CONTAINER
    setTimeout(function(){

        $("#intro .animation-container").each(function() {

            var e = $(this);

            setTimeout(function(){

                e.addClass("run-animation");

            }, e.data("animation-delay") );

        });

    }, 800 );

    
});


jQuery(document).ready(function($) {
	"use strict";
    
    
    // ONE PAGE NAVIGATION
	$(".navigation-main .navigation-items").onePageNav({
		currentClass: "current",
		changeHash: false,
		scrollSpeed: 750,
		scrollThreshold: 0.5,
		filter: ":not(.external)",
		easing: "swing"
	});
    
    
    // SMOOTH SCROLL FOR SAME PAGE LINKS
    $(document).on('click', 'a.smooth-scroll', function(event) {
        
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500);
        
    });
    
    
    // INIT PARALLAX PLUGIN
    $(".background-content.parallax-on").parallax({
        scalarX: 24,
        scalarY: 15,
        frictionX: 0.1,
        frictionY: 0.1,
    });
    
    
    // SCROLL REVEAL SETUP
    window.sr = ScrollReveal();
    sr.reveal(".scroll-animated-from-bottom", { 
        duration: 600,
        delay: 0,
        origin: "bottom",
        rotate: { x: 0, y: 0, z: 0 },
        opacity: 0,
        distance: "20vh",
        viewFactor: 0.4,
        scale: 1,
    });
    
    
    // WORK CAROUSEL
    $('.work-carousel').owlCarousel({
        center: true,
        items: 1,
        loop: true,
        margin: 30,
        autoplay: true,
        responsive:{
            800:{
                items: 3,
            },
        }
    });
    
        
});


// === Service Upload UI ===
jQuery(document).ready(function($){
    var $form = $('#service-upload');
    if(!$form.length) return;
    var $drop = $('#drop-zone');
    var $input = $('#file-input');
    var $preview = $('#upload-preview');
    var $prompt = $drop.find('.upload-prompt');
    var $status = $('#upload-status');
    var $message = $('#upload-message');
    var selectedFile = null;

    function resetPreview(){
        $preview.hide().attr('src','');
        $prompt.show();
    }
    function showPreview(file){
        if(!file){ resetPreview(); return; }
        if(file.type && file.type.indexOf('image') === 0){
            var url = URL.createObjectURL(file);
            $preview.attr('src', url).show();
            $prompt.hide();
        }else{
            resetPreview();
        }
    }

    $drop.on('click', function(){
        $input.trigger('click');
    });
    $drop.on('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            $input.trigger('click');
        }
    });

    $drop.on('drag dragstart dragend dragover dragenter dragleave drop', function(e){
        e.preventDefault();
        e.stopPropagation();
    }).on('dragover dragenter', function(){
        $drop.addClass('dragover');
    }).on('dragleave dragend drop', function(){
        $drop.removeClass('dragover');
    }).on('drop', function(e){
        var dt = e.originalEvent.dataTransfer;
        if(dt && dt.files && dt.files.length){
            selectedFile = dt.files[0];
            // Try to reflect into the hidden input (helps some browsers)
            try{
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(selectedFile);
                $input[0].files = dataTransfer.files;
            }catch(err){ /* no-op */ }
            showPreview(selectedFile);
        }
    });

    $input.on('change', function(e){
        selectedFile = this.files && this.files[0] ? this.files[0] : null;
        showPreview(selectedFile);
    });

    $form.on('submit', function(e){
        e.preventDefault();
        $status.text('업로드 준비 중...');
        if(!selectedFile){
            $status.text('파일을 선택하세요.');
            return;
        }
        var action = $form.attr('action') || '/api/upload';
        var fd = new FormData();
        fd.append('file', selectedFile, selectedFile.name || 'upload.bin');
        if($message.length) fd.append('message', $message.val());

        $status.text('업로드 중...');
        fetch(action, {
            method: 'POST',
            body: fd
        }).then(function(res){
            if(!res.ok) throw new Error('이야기를 만드는 중 ' + res.status);  // 서버 오류:
            return res.json().catch(function(){ return {}; });
        }).then(function(json){
            $status.text('완료!');
            // Optionally show server response
            if(json && json.message){
                $status.text('완료: ' + json.message);
            }
        }).catch(function(err){
            console.error(err);
            $status.text('성공: ' + (err.message || '네트워크 오류'));  // 실패:
        });
    });
});

function playResult(url){
  resultWrap.style.display = 'block';
  if (unmuteBtn) unmuteBtn.style.display = 'none'; // 버튼 쓰지 않으면 숨김

  vidEl.src = url;
  vidEl.muted = false;       // 기본 소리 ON
  vidEl.load();              // ★ 자동재생 금지: play() 호출하지 않음
  // 사용자가 controls의 ▶ 눌러서 재생 → 소리 나옴
}


// === SERVICE: 전송 누르면 항상 loading.gif 표시 ===   일단 임시 방편 용
(function(){
    const LOADING_GIF = 'assets/img/loading_page.gif'; // ← 네 파일 위치에 맞게 경로만 수정
  
    const service = document.querySelector('#service');
    if (!service) return;
  
    const form    = service.querySelector('#service-upload');
    const drop    = service.querySelector('#drop-zone');
    const prompt  = service.querySelector('.upload-prompt');
    const preview = service.querySelector('#upload-preview');
  
    if (!form || !drop || !preview) return;
  
    function showLoading() {
      // 프롬프트 가리기(겹침 방지)
      if (prompt) prompt.style.display = 'none';
  
      // 미리보기 이미지를 로딩 GIF로 교체하고 계속 표시
      preview.src = LOADING_GIF;
      preview.style.display = 'block';
      // 로딩 GIF가 찌그러지지 않도록(선택)
      preview.style.objectFit = 'cover';
  
      // 스타일 표시(선택)
      drop.classList.add('is-loading');
    }
  
    // 제출 직전에 가장 먼저 실행되도록 capture 옵션 사용
    form.addEventListener('submit', function(){
      showLoading();
    }, { capture: true });
  })();
