const redis = require("redis");
const dotenv = require("dotenv");
const { GET, SET, GET_ALL, DELETE } = require("../constants");

dotenv.config();

// var client = redis.createClient(
//   process.env.REMOTE_PORT1,
//   process.env.REMOTE_HOST1,
//   {
//     no_ready_check: true
//   }
// );

var client = redis.createClient(process.env.REDIS_URL, {
  no_ready_check: true
});

module.exports = {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  query(operation, params) {
    return new Promise((resolve, reject) => {
      switch (operation) {
        case SET:
          console.log("query SET");
          var keyId = params._id;
          //delete _Id
          delete params._id;

          client.hmset(keyId, params, (error, reply) => {
            if (error) {
              console.log("error: ", error);
              reject(error);
            }
            console.log("_id", keyId);

            resolve({ reply, keyId, params });
          });
          break;

        case GET:
          console.log("query GET by _id");

          client.hgetall(params._id, (error, reply) => {
            if (error) {
              reject(error);
            }
            if (!reply) {
              resolve(reply);
            } else {
              resolve({ reply, params });
            }
          });
          break;

        case GET_ALL:
          console.log("query GET_ALL");

          client.keys("*", (error, reply) => {
            if (error) {
              reject(error);
            }
            resolve(reply);
          });
          break;

        case DELETE:
          console.log("query DELETE");
          client.del(params._id, (error, reply) => {
            if (error) {
              reject(error);
            }
            resolve(reply);
          });
          break;
        default:
          break;
      }
    });
  }
};

client.on("error", error => {
  console.log("error: " + error);
});
