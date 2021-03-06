var casper = require('casper').create({
    verbose: true,
    logLevel: "info",
    pageSettings: {
        loadPlugins: false,
        loadImages: false,
        userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Iron/31.0.1700.0 Chrome/31.0.1700.0'
    },
    viewportSize: {
        width: 800,
        height: 600
    },
    clientScripts: []
});


var conf = require('private.json');
var login_url = 'https://passport.jd.com/uc/login.aspx';
var vip_url = 'https://vip.jd.com';
var jr_url = 'https://vip.jr.jd.com';
var bk_url = 'https://bk.jd.com/m/money/index.html';

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

casper.on('page.error', function(msg, backtrace) {
    throw new Error(msg);
});

// casper.on("resource.received", function(resource) {
//     this.echo(resource.url);
// });

casper.start(login_url, function() {
    this.fill('form#formlogin', {
        'loginname': conf.username,
        'nloginpwd': conf.password,
        'chkRememberMe': true
    }, true);

    this.waitForResource('showAuthCode', function() {
        this.click('.login-tab.login-tab-r a');
        this.click('#loginsubmit');
    }, function() {
        this.log('LOGIN TIMEOUT!!!', 'error');
    }, conf.timeout);

    this.wait(3000, function() {
        this.capture('g.png');
    });
});

casper.thenOpen(vip_url, function() {
    this.echo(vip_url);
    this.waitForResource('get', function() {
        this.click('.side-shortcut #checkinBtn');
    }, function() {
        this.log('VIP TIMEOUT!!!', 'error');
    }, conf.timeout);

    this.wait(3000, function() {
        this.capture('h.png');
    });
});

casper.thenOpen(jr_url, function() {
    this.echo(jr_url);
    this.waitForResource('get', function() {
        this.click('a#index-qian-btn');
    }, function() {
        this.log('JR TIMEOUT!!!', 'error');
    }, conf.timeout);

    this.wait(3000, function() {
        this.capture('j.png');
    });
});

casper.then(function() {
    this.echo('exit!');
    this.exit();
});

casper.run();
