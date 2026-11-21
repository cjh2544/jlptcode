module.exports = {
  apps: [
    {
      name: "jlptcode",
      script: "./server.js",
      cwd: "/root/www/jlptcode",
      instances: 2,
      exec_mode: "cluster",
      watch: false,
      merge_logs: true,
      max_memory_restart: "900M",
      // rolling reload: 이전 워커 kill 전 대기
      kill_timeout: 5000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
