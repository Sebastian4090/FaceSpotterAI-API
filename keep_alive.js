import https from "https";

const healthcheckUrl = process.env.HEALTHCHECK;

const healthCheck = () => {
  https
    .get(healthcheckUrl, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`Healthcheck response: ${data}`);
      });
    })
    .on("error", (error) => {
      console.error("Error during healthcheck:", error);
    });
};

// 1min
const keepAlive = () => {
  setInterval(healthCheck, 1 * 60 * 1000);
};

export default keepAlive;
