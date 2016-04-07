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
var signup_url = 'https://vip.jd.com';


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
    this.echo(login_url)
    this.fill('form#formlogin', {
        'loginname': conf.username,
        'nloginpwd': conf.password
    }, true);

    this.waitForResource('showAuthCode', function() {
        this.click('#loginsubmit');
    }, function() {
        this.log('LOGIN TIMEOUT!!!', 'error');
    }, conf.timeout);

    this.wait(3000, function() {
        this.capture('b.png');
    });
});

casper.thenOpen(signup_url, function() {
    this.waitForResource('getUnreadNum.action', function() {
        this.click('.btns .signup-btn')
    }, function() {
        this.log('SIGNUP TIMEOUT!!!', 'error');
    }, conf.timeout);

    this.wait(3000, function() {
        this.capture('g.png');
    });
});

casper.run();
