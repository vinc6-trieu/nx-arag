
module.exports = {
    apps: [
      {
        name: "my-app-auth",
        script: "dist/main.js",
        instances: "3",
        exec_mode: "cluster"
      }
    ]
  };
  