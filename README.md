## 简单的使用方法

` 主html `
```html
<!DOCTYPE html>
<html>

	<head>
		<meta charset="UTF-8">
		<title>Goals测试主HTML</title>
		<link rel="stylesheet" href="lib/1.0.0/goals.css" />
	</head>

	<body>
	</body>
	<script type="text/javascript" src="lib/1.0.0/goals.compatibility.js"></script>
	<script type="text/javascript" src="lib/1.0.0/goals.xml.js"></script>
	<script type="text/javascript" src="lib/1.0.0/goals.request.js"></script>
	<script type="text/javascript" src="lib/1.0.0/goals.chaotic.js"></script>
	<script type="text/javascript" src="lib/1.0.0/goals.page.js"></script>
	<script>
		(function(goals) {
			goals.init({
				project: '/Goals',
				hashEncrypt: true,
				page: 'test/one'
			});
		}(Goals));
	</script>
</html>
```

` one.html `
```html
<div>${hello}</div>
```

` one.js `
```javascript
GoalsPage({
    data: {
        hello: 'Hello World'
    },
    notImportDefaultCss: false,
    onready: function() {
        setTimeout(function() {
            this.data.hello = '莫西莫西';
        }, 2000);
    }
})
```