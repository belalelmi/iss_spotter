const request = require('request');

const fetchMyIP = (callback) => {
  const ip = 'https:///api.ipify.org?format=json';
  request(ip, (error, response, body) => {
    if (error) {
      callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ipObject = JSON.parse(body);
    // console.log(ipObject)
    // console.log(ipObject.ip); //is a string
    callback(null, ipObject.ip);
  });
};
const fetchCoordsByIP = (ip, callback) => {
  const coords = `https://freegeoip.app/json/${ip}`;
  request(coords, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when getting coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body); //using in the final function
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when getting flyby times!! Response: ${body}`), null);
      return;
    }
    const lookUpISS = JSON.parse(body).response; //using in the final function
    callback(null, lookUpISS);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
        return;
      }
      fetchISSFlyOverTimes(coordinates, (error, lookUpISS) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, lookUpISS);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
