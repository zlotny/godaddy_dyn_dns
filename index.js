const axios = require('axios');

require('dotenv').config();

var api_url = process.env.API;
var auth_header = `sso-key ${process.env.KEY}:${process.env.SECRET}`;

var previousIP = null;

checkIfNewIP();

setInterval(async () => {
    checkIfNewIP();
}, 3600 * 1000);

async function checkIfNewIP() {
    const res = await axios.get('https://api.ipify.org?format=json');
    let ip = res.data.ip;
    console.log("Cheking if IP was changed");
    console.log("Previous IP was", previousIP, "; new IP is:", ip);
    if (ip != previousIP) {
        updateGoDaddy(ip);
        previousIP = ip;
    }
}

async function updateGoDaddy(ip) {
    console.log("Need to update with goDaddy. New IP is", ip);

    const res = await axios.get(`${api_url}/v1/domains/ndrs.es/records/A`, {
        headers: {
            'Authorization': auth_header
        }
    });

    res.data.forEach(async (element) => {
        let name = element.name;
        let request_url = `${api_url}/v1/domains/ndrs.es/records/A/${name}`;
        console.log("Requesting:", request_url, "to be new ip", ip);
        const res2 = await axios.put(
            request_url,
            [{
                "data": ip
            }],
            {
                headers: {
                    'Authorization': auth_header
                }
            }
        );
    });
}