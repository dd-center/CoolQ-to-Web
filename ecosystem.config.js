module.exports = {
  apps: [{
    name: 'CoolQ/master',
    script: 'master.js',
    instances: 1,
    autorestart: true,
    watch: false
  }, {
    name: 'CoolQ/worker',
    script: 'worker.js',
    instances: 4,
    autorestart: true,
    watch: false
  }]
}
