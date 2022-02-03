module.exports = {
  apps: [{
    name: 'server',
    script: 'pm2 start node_modules/ts-node -- -P tsconfig.json index.ts',
  },
  ],

  deploy: {
    production: {
      key: '/home/user/.ssh/server_google_rsa',
      user: 'sluip',
      host: '34.118.50.162',
      ref: 'origin/pre_deploy',
      repo: 'https://github.com/Sluip430/BE_course/src',
      path: '/home/sluip/FirstDeploy',
      ssh_options: ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      'pre-setup': 'rm -rf /home/sluip/FirstDeploy',
      'post-deploy': 'npm install && pwd &&pm2 start /home/sluip/FirstDeploy/current/node_modules/.bin/ts-node -- -P tsconfig.json index.ts',
    },
  },
};
