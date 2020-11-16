(function() {
    Goals.init({
        container: document.getElementById('container'),
        project: 'Goals2.0',
        page: 'page/test'
    });
    var btns = document.getElementById('btns').querySelectorAll('button');
    for(var i = 0, r; r = btns[i++];) {
        r.addEventListener('click', function() {
            Goals.open('page/' + this.getAttribute('page'));
        });
    }
}());