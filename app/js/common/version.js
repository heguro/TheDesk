//バージョンチェッカー
function verck(ver, jp) {
	if (store) return false
	console.log('%c Welcome😊 ' + ver, 'color: red;font-size:200%;')
	$('body').addClass(localStorage.getItem('platform'))
	var date = new Date()
	var showVer = false
	//Spotify
	if (localStorage.getItem('spotify')) {
		localStorage.removeItem('spotify')
		localStorage.removeItem('spotify-refresh')
		var spDc = 'Spotify NowPlaying sysytem was changed, please re-login to Spotify'
		if(lang.language == 'ja') {
			spDc = 'Spotify NowPlayingの機能が変更されたため、もう一度ログインしてください'
		}
		Swal.fire({
			type: 'info',
			title: spDc,
		})
	}
	//Spotify(e)
	if (localStorage.getItem('ver') != ver && localStorage.getItem('winstore')) {
		showVer = true
		console.log('%c Thank you for your update🎉', 'color: red;font-size:200%;')
		$(document).ready(function() {
			if (localStorage.getItem('winstore') && !pwa) {
				$('#releasenote').modal('open')
			}
			verp = ver.replace('(', '')
			verp = verp.replace('.', '-')
			verp = verp.replace('.', '-')
			verp = verp.replace('[', '-')
			verp = verp.replace(']', '')
			verp = verp.replace(')', '')
			verp = verp.replace(' ', '_')
			console.log('%c ' + verp, 'color: red;font-size:200%;')
			if (lang.language == 'ja') {
				$('#release-' + verp).show()
			} else {
				$('#release-en').show()
			}
		})
	}
	localStorage.setItem('ver', ver)
	if (!showVer) {
		console.log(showVer)
		if (
			date.getFullYear() * 100 + date.getMonth() + 1 >= localStorage.getItem('showSupportMe') ||
			!localStorage.getItem('showSupportMe')
		) {
			if (date.getMonth() == 11) {
				var yrs = date.getFullYear() + 1
				var nextmonth = yrs * 100 + 1
			} else {
				var yrs = date.getFullYear() 
				var nextmonth = yrs * 100 + date.getMonth() + 2
			}
			if (lang.language != 'ja') {
				$('#support-btm-ja').addClass('hide')
				$('#support-btm-en').removeClass('hide')
			}
			localStorage.setItem('showSupportMe', nextmonth)
			$('#support-btm').removeClass('hide')
			$('#support-btm').animate(
				{
					bottom: '0'
				},
				{
					duration: 300
				}
			)
		}
	}
	var platform = localStorage.getItem('platform')
	console.log('Your platform:' + platform)
	if (!localStorage.getItem('winstore') && !pwa) {
		$('#start').css('display', 'flex')
	}
	if (
		localStorage.getItem('winstore') == 'brewcask' ||
		localStorage.getItem('winstore') == 'snapcraft' ||
		localStorage.getItem('winstore') == 'winstore'
	) {
		var winstore = true
	} else {
		var winstore = false
	}
	var l = 5
	// 生成する文字列に含める文字セット
	var c = 'abcdefghijklmnopqrstuvwxyz0123456789'
	var cl = c.length
	var r = ''
	for (var i = 0; i < l; i++) {
		r += c[Math.floor(Math.random() * cl)]
	}
	var start = 'https://thedesk.top/ver.json'
	fetch(start, {
		method: 'GET'
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			todo(error)
			setLog(start, 'JSON', error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function(mess) {
			console.table(mess)
			if (mess) {
				//askjp_jp_ua: 2019年10月24日、mstdn.jpによるユーザーエージェントアクセス制限
				if (jp && mess.jp_ua && !localStorage.getItem('askjp_jp_ua')) {
					localStorage.setItem('askjp_jp_ua', true)
					$('#askjp_jp_ua').removeClass('hide')
				}
				var platform = localStorage.getItem('platform')
				if (platform == 'darwin') {
					var newest = mess.desk_mac
				} else {
					var newest = mess.desk
				}
				if (newest == ver) {
					todo(lang.lang_version_usever.replace('{{ver}}', mess.desk))
					//betaかWinstoreならアプデチェックしない
				} else if (ver.indexOf('beta') != -1 || winstore) {
				} else {
					localStorage.removeItem('instance')
					if (localStorage.getItem('new-ver-skip')) {
						if (localStorage.getItem('next-ver') != newest) {
							postMessage(['sendSinmpleIpc', 'update'], '*')
						} else {
							console.warn(lang.lang_version_skipver)
							todo(lang.lang_version_skipver)
						}
					} else {
						postMessage(['sendSinmpleIpc', 'update'], '*')
					}
				}
			}
		})
	if (!localStorage.getItem('last-notice-id')) {
		localStorage.setItem('last-notice-id', 0)
	}
	var start = 'https://thedesk.top/notice/index.php?since_id=' + localStorage.getItem('last-notice-id')
	fetch(start, {
		method: 'GET',
		cors: true
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function(mess) {
			if (mess.length < 1) {
				return false
			} else {
				var last = localStorage.getItem('last-notice-id')
				localStorage.setItem('last-notice-id', mess[0].ID)
				for (i = 0; i < mess.length; i++) {
					var obj = mess[i]
					if (obj.ID * 1 <= last) {
						break
					} else {
						if (obj.type == 'textv2') {
							if (~obj.languages.indexOf(lang.language)) {
								var showVer = true
								if (obj.toot != '') {
									var toot =
										'<button class="btn-flat toast-action" onclick="detEx(\'' +
										obj.toot +
										"','main')\">Show</button>"
								} else {
									var toot = ''
								}
								if (obj.ver != '') {
									if (obj.ver == ver) {
										showVer = true
									} else {
										showVer = false
									}
								}
								if (obj.domain != '') {
									var multi = localStorage.getItem('multi')
									if (multi) {
										showVer = false
										var accts = JSON.parse(multi)
										Object.keys(accts).forEach(function(key) {
											var acct = accts[key]
											if (acct.domain == obj.domain) {
												showVer = true
											}
										})
									}
								}
								if (showVer) {
									M.toast({
										html:
											escapeHTML(obj.text) +
											toot +
											'<span class="sml grey-text">(スライドして消去)</span>',
										displayLength: 86400
									})
								}
							}
						}
					}
				}
			}
		})
}
var infostreaming = false
function infowebsocket() {
	infows = new WebSocket('wss://thedesk.top/ws/')
	infows.onopen = function(mess) {
		console.log([tlid, ':Connect Streaming Info:', mess])
		infostreaming = true
	}
	infows.onmessage = function(mess) {
		console.log([tlid, ':Receive Streaming:', JSON.parse(mess.data)])
		var obj = JSON.parse(mess.data)
		if (obj.type != 'counter') {
			if (obj.type == 'textv2') {
				if (~obj.languages.indexOf(lang.language)) {
					localStorage.setItem('last-notice-id', obj.id)
					var showVer = true
					if (obj.toot != '') {
						var toot =
							'<button class="btn-flat toast-action" onclick="detEx(\'' +
							obj.toot +
							"','main')\">Show</button>"
					} else {
						var toot = ''
					}
					if (obj.ver != '') {
						if (obj.ver == ver) {
							showVer = true
						} else {
							showVer = false
						}
					}
					if (obj.domain != '') {
						var multi = localStorage.getItem('multi')
						if (multi) {
							showVer = false
							var accts = JSON.parse(multi)
							Object.keys(accts).forEach(function(key) {
								var acct = accts[key]
								if (acct.domain == obj.domain) {
									showVer = true
								}
							})
						}
					}
					if (showVer) {
						console.log(obj.text)
						console.log(escapeHTML(obj.text))
						M.toast({
							html:
								escapeHTML(obj.text) +
								toot +
								'<span class="sml grey-text">(スライドして消去)</span>',
							displayLength: 86400
						})
					}
				}
			}
		} else {
			$('#persons').text(obj.text)
		}
	}
	infows.onerror = function(error) {
		infostreaming = false
		console.error('Error closing:info')
		console.error(error)
		return false
	}
	infows.onclose = function() {
		infostreaming = false
		console.error('Closing:info')
	}
}
setInterval(function() {
	if (!infostreaming) {
		console.log('try to connect to base-streaming')
		infowebsocket()
	}
}, 10000)
function openRN() {
	$('#releasenote').modal('open')
	if (lang.language == 'ja') {
		verp = ver.replace('(', '')
		verp = verp.replace('.', '-')
		verp = verp.replace('.', '-')
		verp = verp.replace('[', '-')
		verp = verp.replace(']', '')
		verp = verp.replace(')', '')
		verp = verp.replace(' ', '_')
		$('#release-' + verp).show()
	} else {
		$('#release-en').show()
	}
}
function closeSupport() {
	$('#support-btm').animate(
		{
			bottom: '-300px'
		},
		{
			duration: 300,
			complete: function() {
				$('#support-btm').addClass('hide')
			}
		}
	)
}
function closeStart() {
	$('#start').css('display', 'none')
	var platform = localStorage.getItem('platform')
	var ver = localStorage.getItem('ver')
}
