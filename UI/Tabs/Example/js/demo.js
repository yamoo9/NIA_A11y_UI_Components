(function(exports, $){
	'use strict';

    // WAI-ARIA 탭 UI, jQuery 플러그인 데모
    /*
        플러그인 옵션
        [플러그인 접두사]
            'prefix': 'uiTabs',
        [WAI-ARIA 사용 유무 설정]
            'aria': true,
        [클래스 속성 설정]
            'tablist': 'tablist',
            'tab': 'tab',
            'tabpanel': 'tabpanel',
        [초기 활성화 인덱스]
            'activeIndex': 1
     */

    // 플러그인 기본 옵션 사용 예
	var $demo_tabs = $('.demo-tabs').uiTabs();

    // 플러그인 사용자 정의 옵션 사용 시 예
    // var $demo_tabs = $('.demo-tabs').uiTabs({
    //     // 'prefix': 'nia',
    //     // 'aria': false,
    //     // 'tablist': 'tl',
    //     // 'tab': 'tb',
    //     // 'tabpanel': 'tp',
    //     // 'activeIndex': 1
    // });

    // 활성화 탭 사용 예
    // $demo_tabs.uiTabs('activeTab', 2);

    // WAI-ARIA 제거 메소드 사용 예
    // $demo_tabs.uiTabs('unsettingAria');


    var $demo_tabs2 = $('.demo-tabs-2').uiTabs();

    // 리플 이펙트 설정 예
    $demo_tabs.find('ul').uiRipple({
        'sound': true,
        // 'sound_source': 'media/tong.mp3',
        'color': 'hsla(188, 87%, 58%, 0.56)'
    });

})(this, this.jQuery);