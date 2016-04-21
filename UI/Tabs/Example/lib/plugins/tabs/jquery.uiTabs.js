/*! jquery.uiTabs.js © yamoo9.net, 2016 */
;(function(exports, $){
	'use strict';

	// Array 객체의 메소드 slice 빌려쓰기
	var slice = Array.prototype.slice;

	// 플러그인 기본 옵션 객체
	var defaults = {
		// 플러그인 접두사
		'prefix': 'uiTabs',
		// WAI-ARIA 사용 유무 설정
		'aria': true,
		// 클래스 속성 설정
		'tablist': 'tablist',
		'tab': 'tab',
		'tabpanel': 'tabpanel',
		// 초기 활성화 인덱스
		'activeIndex': 1
	};

	// 플러그인 객체
	var plugin = {

		// 1. 초기화 ---------------------------------------------------------------
		'init': function(options) {

			// 1.1 options 유형 체크
			// 옵션 덮어쓰기 (믹스인 패턴, 객체 합성)
			options = $.extend({}, defaults, options);

			// 1.2
			// 플러그인이 적용된 jQuery 인스턴스 객체를 참조하는 변수 $tab_containers를 정의한다.
			var $tab_containers = this;

			// $tab_containers.data('options') 설정
			$tab_containers.data('options', options);

			// 플러그인이 연결된 요소들을 순환하여 처리할 수 있도록 $.each() 유틸리티 메소드를 사용한다.
			return $.each($tab_containers, function(index, tab) {
				// 개별 탭 리스트 요소를 제어하기 위해 변수 $tablist를 정의 한다.
				// ※ 이와 같이 처리하는 이유는 $() 팩토리 함수 남용(성능 저하)을 방지하기 위해서이다.
				var $tab_container = $tab_containers.eq(index);

				// 1.3 WAI-ARIA 설정
				// 옵션의 aria 속성 값이 true일 경우, plugin.settingAria() 메소드 실행
				// plugin.settingAria() 메소드 컨텍스트를 $tab_container로 전달
				options.aria && plugin.settingAria.call($tab_container);

				// 1.4 class 속성 설정
				plugin.settingClassName.call($tab_container);

				// 1.5 이벤트 설정
				plugin.addEvents.call($tab_container);

				// 1.6 초기 활성화 설정
				plugin.activeTab.call($tab_container, options.activeIndex);

			});

		},

		// 2. 플러그인 메소드 --------------------------------------------------------

		// 2.1.1 WAI-ARIA 설정 메소드
		'settingAria': function() {
			// 컨텍스트 객체를 참조하는 변수 $tab_container 정의
			var $tab_container = this,
				options = $tab_container.data('options'),
				$tablist = $tab_container.children('ul'),
				$tabs, $tabpanels=[];

			// 2.1.1 역할 설정
			// <ul> role="tablist"
			// <li> role="presentation"
			// <a> role="tab"
			$tablist.attr('role', 'tablist');
			$tablist.find('li').attr('role', 'presentation');
			$tabs = $tablist.find('a').attr('role', 'tab');
			// $tab에 연결된 tabpanel 요소를 찾아 역할 설정
			// <div id="{$tab.id}"> role="tabpanel"
			$.each($tabs, function(index, tab) {
				var $tab = $tabs.eq(index),
					// tab 요소 id 이름 설정
					tab_id = options.prefix + '-' + options.tab + '-' + (index+1),
					tabpanel_id = $tab.attr('href');

				$tabpanels.push( $( tabpanel_id ).attr('role', 'tabpanel') );

				// 2.1.2 속성/상태 설정
				$tab.attr({
					// 속성
					'id': tab_id, // tab 요소 id 설정
					'aria-controls': tabpanel_id,
					// 상태
					'tabindex': -1,
					'aria-hidden': true,
					'aria-selected': false
				});

				$tabpanels[index].attr({
					// 속성
					'aria-labelledby': tab_id,
					// 상태
					// 'tabindex': -1,
					'aria-hidden': true,
					'aria-expanded': false
				});

			});
		},
		// 2.1.2 WAI-ARIA 설정 해제 메소드
		'unsettingAria': function() {
			// 컨텍스트 객체를 참조하는 변수 $tab_container 정의
			var $tab_container = this,
				$all = $tab_container.find('*'),
				removelist = 'role, aria-hidden, aria-labelledby, aria-controls, aria-selected, aria-expanded, tabindex'.split(', ');
			$.each(removelist, function(index, item) {
				$all.removeAttr(item);
			});
		},

		// 2.2 class 속성 설정 메소드
		'settingClassName': function() {
			var $tab_container = this,
				options = $tab_container.data('options'),
				$tablist = $tab_container.children('ul').addClass(options.prefix+'-'+options.tablist),
				$tabs = $tablist.find('a').addClass(options.prefix+'-'+options.tab);
			$.each($tabs, function(index, tab) {
				var $tab = $tabs.eq(index);
				$( $tab.attr('href') ).addClass(options.prefix+'-'+options.tabpanel);
			});
		},

		// 2.3.1 이벤트 바인딩
		'addEvents': function() {
			// 컨텍스트 객체를 참조하는 변수 $tab_container 정의
			var $tab_container = this,
				options = $tab_container.data('options'),
				$tabs = $tab_container.find('.'+options.prefix+'-'+options.tab);

			$.each($tabs, function(index, tab) {
				var $tab = $tabs.eq(index);
				$tab.on({
					'click.updateState': $.proxy(updateState, $tab),
					'keydown.focusMoveTab': $.proxy(focusMoveTab, $tab),
				});
			});

			// 이벤트 핸들러
			function updateState(e) {
				// 기본 동작 차단
				e.preventDefault();

				// 탭 패널 참조
				var $tabpanel = $(this.attr('href')),
					tab = '.'+options.prefix+'-'+options.tab,
					on = options.prefix+'-on',
					tabpanel = '.'+options.prefix+'-'+options.tabpanel,
					view = options.prefix+'-view';

				// 상태 업데이트
				if (options.aria ) {
					// 활성화
					this.attr({
						'aria-hidden': false,
						'tabindex': 0,
						'aria-selected': true
					});
					$tabpanel.attr({
						// 'tabindex': 0,
						'aria-hidden': false,
						'aria-expanded': true
					});

					// 비활성화
					this.parent().siblings().find(tab).attr({
						'aria-hidden': true,
						'tabindex': -1,
						'aria-selected': false
					});
					$tabpanel.siblings(tabpanel).attr({
						'aria-hidden': true,
						'aria-expanded': false
					})
				}

				this.addClass(on)
					.parent().siblings().find(tab)
					.removeClass(on);

				$tabpanel
					.addClass(view)
					.siblings(tabpanel)
					.removeClass(view);
			}

			function focusMoveTab(e) {
				var key = e.keyCode,
					$parent = this.parent(),
					$parent_prev = $parent.prev(),
					$parent_next = $parent.next(),
					tab_class = '.'+options.prefix+'-'+options.tab;

				// 이전 (←(37), ↑(38))
				if (key === 37 || key === 38 ) {
					( $parent_prev.length ? $parent_prev : $parent.nextAll().last()).find(tab_class).focus();
				}
				// 다음 (→(39), ↓(40))
				if (key === 39 || key === 40 ) {
					( $parent_next.length ? $parent_next : $parent.siblings().first()).find(tab_class).focus();
				}
			}
		},

		// 2.4 탭 메뉴 활성화 메소드
		'activeTab': function(index) {
			// 컨텍스트 객체를 참조하는 변수 $tab_container 정의
			var $tab_container = this,
				options = $tab_container.data('options');

			// 0 전달 시 통과
			// 1 전달 시, 1을 감소하여 0으로 변경
			if (index !== 0) { index--; }

			// 플러그인이 적용된 jQuery 인스턴스 객체 내부에서 전달된
			// index 값에 해당하는 조건을 가진 tab 역할 요소를 클릭한다.
			$tab_container.find('.'+options.prefix+'-'+options.tab).eq(index).trigger('click');
		}
	};

	// 플러그인 uiTabs 정의
	$.fn.uiTabs = function(method_or_options) {
		// 전달인자 검증
		// 1. 플러그인 메소드일 경우
		if( plugin[method_or_options] ) {
			// 플러그인 메소드에 jQuery 인스턴스 객체와 첫번째 인자를 제외한 나머지 인자를 제공한다.
			return plugin[method_or_options].apply(this, slice.call(arguments, 1));
		}
		// 2. 전달인자가 없거나, 인자 유형이 객체(사용자 정의 옵션)인 경우
		else if (!method_or_options || $.type(method_or_options) === 'object') {
			// 플러그인 초기화(Initialization)
			return plugin.init.apply(this, arguments);
		}
		// 3. 오류가 발생한 경우
		else {
			console.error('전달된 플러그인 인자 "'+method_or_options+'"는 플러그인 메소드가 아닙니다.');
		}
	};

	// 외부에 플러그인 기본 옵션 객체 공개 (제어 가능)
	$.fn.uiTabs.defaults = defaults;

})(this, this.jQuery);