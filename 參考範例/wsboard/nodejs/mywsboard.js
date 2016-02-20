var net = require('net'),
sys = require('sys');

var ws = require("./ws76").ws;

/*var Admin = net.createServer(function(stream){
	var cmd = '';
	stream.setEncoding('ascii');
	stream.on('data', function(data){
		cmd += data;
		if(cmd.indexOf('quit')>-1) {
			sys.log('server stopping');
			stream.end();
			stream.destroy();
			Server.close();
			Server1.close();
			Admin.close();
		}
	});
});*/
//Admin.listen(8081, '127.0.0.1');

new ws(net, sys)
    .start(8080, '127.0.0.1')
    .route('/chat', function(content, clients, sid) {
        var sync = null;
        try {
            sync = JSON.parse(content).sync;
        } catch(e) {
            sys.log(e);
        }
        for(var i in clients) {
	        if(clients.hasOwnProperty(i) && (sync=="all" || (sync=="other" && i!=sid) || (sync=="self" && i==sid))) {
		        this.writePacket(content, clients[i]);
	        }
        }
    });
