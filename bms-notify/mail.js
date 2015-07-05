(function(module) {
    var nodemailer = require('nodemailer');
    var generator = require('xoauth2').createXOAuth2Generator({
        user: '',
        clientId: '',
        clientSecret: '',
        refreshToken: '',
        accessToken: '' // optional
    });

    // listen for token updates
    // you probably want to store these to a db
    generator.on('token', function(token) {
        console.log('New token for %s: %s', token.user, token.accessToken);
    });

    // login
    var transporter = nodemailer.createTransport(({
        service: 'gmail',
        auth: {
            xoauth2: generator
        }
    }));

    var mailOptions = {
        from: '',
        to: '',
        subject: 'hello world!'
    };

    var sendMail = function(movie_name) {
    	mailOptions.subject = 'BMS-APP Alert';
        mailOptions.text = movie_name;
        // send mail
        transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Mail sent to : ' + mailOptions.to +'\n' + info.response);
		    console.log('Exiting BMS-APP');
		    process.exit();
		});
    };

    module.exports = {
        sendMail: sendMail
    };
})(module);
