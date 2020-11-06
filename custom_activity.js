(function() {

	//This may not show up immediately - give it about 30s though and it should show up - if not, maybe check the validity of the following
	const activity = { //https://discord.com/developers/docs/topics/gateway#activity-object
		type: 0,
		name: "with Pingcord",
		details: "Visit git.io/Pingcord",
		state: "v0.0.1",
		application_id: "634126243012542484", //bot -> client_id
		assets: {
			large_image: "ping", //bot -> art assets -> upload -> inspect element and get the background code
			//large_text: "OpenDiscord",
			small_image: "null",
			small_text: "null"
		}
	};


	const nativeWebSocket = window.WebSocket;

	window.WebSocket = function(url, protocols) {
		const socket = new nativeWebSocket(url, protocols);

		this.send = (data) => { //tried to proxy this instead, but it didn't work
			const obj = JSON.parse(data);
			switch(obj.op) {
				case 2:
					obj.d.presence.activities = [activity];
					break;

				case 3:
					obj.d.activities = [activity];
					break;
			}
			socket.send(JSON.stringify(obj));
		}

		this.close = (code, reason) => socket.close(code, reason);

		for(const x in socket) {
			if(!this[x]) { //don't overrite anything already here (close/send)
				Object.defineProperty(this, x, {
					get: () => socket[x],
					set: (v) => { socket[x] = v }
				});
			}
		}
	}
})();
