const redis = require("redis");
const dotenv = require("dotenv");
var uuid = require("uuid/v4");

dotenv.config();

const retry_strategy = function(options) {
  if (
    options.error &&
    (options.error.code === "ECONNREFUSED" ||
      options.error.code === "NR_CLOSED")
  ) {
    // Try reconnecting after 5 seconds
    console.error("The server refused the connection. Retrying connection...");
    return 5000;
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands with an individual error
    return new Error("Retry time exhausted");
  }
  if (options.attempt > 50) {
    // End reconnecting with built in error
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
};

var client = redis.createClient(
  process.env.LOCAL_PORT,
  process.env.LOCAL_HOST,
  {
    no_ready_check: true
    //retry_strategy: retry_strategy
  }
);
// client.auth(process.env.PWD, () => {
//   console.log("authenticated!");
// });

/**
 * Create Keys
 */
// var key = "";
const createKeys = () => {
  var key = uuid();
  key = "foo";
  client.set(
    key,
    "My first redis key-value pair using node redis",
    (error, reply) => {
      if (error) console.log("client.set error: ", error);
      console.log("redis set done, value: ", reply);
    }
  );
};

/**
 * Delete Keys
 */
const deleteKeys = () => {
  client.del("foo", (error, value) => {
    if (error) console.log("client.get error: ", error);
    console.log("keys deleted: ", value);
  });
};

client.on("connect", () => {
  console.log("connected");
});

client.on("ready", () => {
  console.log("ready!");
});

// client.exists("foo", (error, reply) => {
//   if (error) console.log("client.exists error: ", error);

//   if (reply === 1) {
//     console.log("key already exists!");
//   } else {
//     console.log("key doesn't exist!");
//   }
// });

client.on("error", error => {
  console.log("error: " + error);
});

module.exports = {
  createKeys,
  deleteKeys
};

//require("make-runnable");

/*
we require make-runnable package -
We need this to be able to call and any of our two functions from the terminal.
Note: You have to require make-runnable at the end. 
Also, don't forget to install make-runnable as project dev-dependency.
*/
