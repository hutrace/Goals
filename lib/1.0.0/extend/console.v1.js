!(function(Goals, doc) {
	var session = Goals.session;
	var common = Goals.common;
	var utils = Goals.utils;
	var storage = Goals.storage;
	var SESSION_USER_KEY = common.PROJECT_NAME + '_user';
	var SESSION_MODULE_KEY = common.PROJECT_NAME + '_modules';
	var STORAGE_LEFT_SHOW_KEY = common.PROJECT_NAME + '_left_show';
	var CONSOLE_ID = 'console.v1';
	var user = session.get(SESSION_USER_KEY);
	if(!user) {
		// TODO 给提示,点击确认后重新登录
		// 还需要判断是否自动登录
		throw new Error('The session key is [' + SESSION_USER_KEY + '] and the value is [' + user + '].');
	}
	var modules = session.get(SESSION_MODULE_KEY);
	if(!modules) {
		// TODO 给提示,点击确认后重新登录
		// 还需要判断是否自动登录
		throw new Error('The session key is [' + SESSION_MODULE_KEY + '] and the value is [' + modules + '].');
	}
	// header
	(function() {
		var header = doc.getElementById('global-header');
		var header_info_height = 0;
		var header_info_img;
		var header_info;
		var userhead = doc.createElement('div');
		var headimg = 'img/console/default-head.jpg';
		var userName = user.nickName;
		var lastLoginTime = user.lastLoginTime || '';
		var lastLoginIp = user.lastLoginIp || '';
		var html = '<img src="' + headimg + '"/>' +
				'<div id="global-header-info" class="global-header-info">' +
				'	<div class="global-header-username">' + userName + '</div>' +
				'	<img id="global-header-info-img" style="width:60px;height:60px;border-radius:50%;">' +
				'	<div class="global-header-login-info">' +
				'		<p style="margin: 0 0 5px;"><a class="global-default-a" href="javascript:;" id="update-user-info-btn">修改个人资料</a></p>' +
				'		<p style="margin: 0 0 5px;">上次登录时间：' + lastLoginTime + '</p>' +
				'		<p style="margin: 0 0 5px;">上次登录地址：' + lastLoginIp + '</p>' +
				'		<p style="margin: 0 0 5px;">不是自己登录？请 <a id="global-update-pwd-btn" class="global-default-a" href="javascript:;">修改密码</a></p>' +
				'	</div>' +
				'	<div style="width:100%;border-top:1px solid #efefef;padding:8px 0;color:#fff;">' +
				'		<a href="javascript:;" id="global-loginout" style="color:#ffadad;">退出登录</a>' +
				'	</div>' +
				'</div>';
		userhead.className = 'global-header-user';
		userhead.innerHTML = html;
		header.appendChild(userhead);
		header_info_img = doc.getElementById('global-header-info-img');
		header_info_img.onload = function() {
			header_info = doc.getElementById('global-header-info');
			header_info_height = header_info.clientHeight || header_info.offsetHeight;
			header_info.style.height = 0;
			header_info.style.visibility = 'visible';
		}
		header_info_img.src = headimg;
		utils.hover(userhead, function() {
			header_info.style.height = header_info_height + 'px';
		}, function() {
			header_info.style.height = 0;
		});
	}());
	(function() {
		var left = doc.getElementById('global-left');
		var parent = doc.getElementById('global-left-parent');
		var child = doc.getElementById('global-left-child');
		var container = doc.getElementById('global-container');
		var animate = '-webkit-transition: width 0.2s ease-in-out;-moz-transition: width 0.2s ease-in-out;-o-transition: width 0.2s ease-in-out;transition: width 0.2s ease-in-out;';
		var isinit = true;
		var show;
		function init_left_width() {
			show = storage.get(STORAGE_LEFT_SHOW_KEY);
			if(show == 'false') {
				left_hide();
				show = false;
			}else {
				show = true;
				left_show();
			}
			isinit = false;
		}
		function set_style(el, str) {
			if(isinit) {
				el.setAttribute('style', 'width:' + str + ';' + animate);
			}else {
				el.style.width = str;
			}
		}
		function left_show() {
			set_style(left, '334px');
			set_style(parent, '180px');
			set_style(container, 'calc(100% - 334px)');
		}
		function left_hide() {
			set_style(left, '200px');
			set_style(parent, '46px');
			set_style(container, 'calc(100% - 200px)');
		}
		var selected_index1 = 0;
		var selected_index2 = 0;
		var selected_index3 = -1;
		var selected_total_index3 = -1;
		var current_pages;
		function create_child(index) {
			var parent_menu = modules[index];
			var pages = parent_menu.pages;
			current_pages = pages;
			var html = '<div class="title">' + parent_menu.name + '</div>';
			var total_index = 0;
			pages.forEach(function(r, i) {
				if(r.show) {
					if(r.pages) {// 三级
						var height = r.pages.length * 36;
						html += `
							<div class="three-menu" index="${i}" data-height="${height}">${r.name}
								<i class="fa fa-caret-left${i == selected_index2 ? ' ct-right' : ''}"></i>
							</div><div class="three-item" index="${i}" style="height: ${i == selected_index2 ? height : 0}px;">
						`;
						r.pages.forEach(function(e, j) {
							if(e.show) {
								if(i == selected_index2 && j == selected_index3) {
									selected_total_index3 = total_index;
									html += `<div class="item selected" index="${j}" total-index="${total_index}">${e.name}</div>`;
								}else {
									html += `<div class="item" index="${j}" total-index="${total_index}">${e.name}</div>`;
								}
								total_index ++;
							}
						});
						html += '</div>';
					}else {// 二级
						html += `<div class="item${i == selected_index2 ? ' selected' : ''}" index="${i}">${r.name}</div>`;
						total_index ++;
					}
				}
			});
			child.innerHTML = html;
		}
		function create_left_html() {
			var html = '<div id="global-left-menu-switch" class="global-left-switch-right"><i class="fa fa-caret-left"></i></div>';
			modules.forEach(function(r, i) {
				if(r.show) {
					html += `
						<div class="item${i == selected_index1 ? ' selected' : ''}" index="${i}">
							<span class="item-icon">${r.icon || '<i class="fa">' + r.name[0] + '</i>'}</span>
							<span class="item-title">${r.name}</span>
						</div>
					`;
				}
			});
			parent.innerHTML = html;
			create_child(selected_index1);
			var $left_switch = $('#global-left-menu-switch');
			function switch_animate(remove, add) {
				$left_switch.fadeOut(200, function() {
					$left_switch.removeClass(remove);
					$left_switch.addClass(add);
					$left_switch.fadeIn(300);
				});
			}
			$left_switch.click(function() {
				if(show) {
					switch_animate('global-left-switch-left', 'global-left-switch-right');
					left_hide();
					show = false;
				}else {
					switch_animate('global-left-switch-right', 'global-left-switch-left');
					left_show();
					show = true;
				}
				storage.add(STORAGE_LEFT_SHOW_KEY, show)
			});
		}
		function init_left_html() {
			var url = Goals.currentUrl();
			url = url.split(CONSOLE_ID)[1];
			var pages1, pages2;
			for(var i = 0, r; r = modules[i++];) {
				pages1 = r.pages;
				for(var j = 0, e; e = pages1[j++];) {
					pages2 = e.pages;
					if(pages2) {
						for(var x = 0, m; m = pages2[x++];) {
							if(m.url === url) {
								selected_index1 = i - 1;
								selected_index2 = j - 1;
								selected_index3 = x - 1;
							}
						}
					}else {
						if(e.url === url) {
							selected_index1 = i - 1;
							selected_index2 = j - 1;
						}
					}
				}
			}
		}
		function bind_left_click() {
			var $parent = $(parent);
			var $child = $(child);
			var $parent_items = $parent.find('.item');
			var $child_items = $child.find('.item');
			$parent.on('click', '.item', function() {
				$parent_items[selected_index1].classList.remove('selected');
				this.classList.add('selected');
				selected_index1 = parseInt(this.getAttribute('index'));
				var pages1 = modules[selected_index1].pages[0];
				selected_index2 = 0;
				selected_index3 = -1;
				if(pages1.pages) {// 三级
					selected_index3 = 0;
					Goals.open(CONSOLE_ID + pages1.pages[0].url);
				}else {// 二级
					Goals.open(CONSOLE_ID + pages1.url);
				}
				create_child(selected_index1);
				$parent_items = $parent.find('.item');
				$child_items = $child.find('.item');
			});
			$child.on('click', '.item', function() {
				if(selected_total_index3 != -1) {// 原本在三级
					$child_items[selected_total_index3].classList.remove('selected');
				}else {
					for(var i = 0, r; r = $child_items[i++];) {
						if(r.getAttribute('index') == selected_index2) {
							r.classList.remove('selected');
						}
					}
				}
				var index = parseInt(this.getAttribute('index'));
				var total_index = this.getAttribute('total-index');
				if(total_index) {
					var pindex = parseInt(this.parentNode.getAttribute('index'));
					selected_total_index3 = parseInt(total_index);
					selected_index2 = pindex;
					selected_index3 = index;
					Goals.open(CONSOLE_ID + modules[selected_index1].pages[pindex].pages[index].url);
				}else {
					selected_index2 = index;
					selected_total_index3 = -1;
					Goals.open(CONSOLE_ID + modules[selected_index1].pages[index].url);
				}
				this.classList.add('selected');
			});
			$child.on('click', '.three-menu', function() {
				var item = $(this).next();
				var height = item.height();
				if(height === 0) {
					item.css({height: this.getAttribute('data-height') + 'px'});
				}else {
					item.css({height: '0px'});
				}
			});
		}
		init_left_width();
		init_left_html();
		create_left_html();
		bind_left_click();
	}());
}(Goals, document));