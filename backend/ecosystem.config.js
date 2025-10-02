module.exports = {
  apps: [{
    name: 'api-key-management',
    script: 'server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    
    // Performance settings
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Environment
    env: {
      NODE_ENV: 'development',
      PORT: 8080
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring
    monitoring: false,
    
    // Auto restart settings
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    
    // Advanced settings
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Health check
    health_check_grace_period: 3000,
    
    // Graceful shutdown
    shutdown_with_message: true,
    
    // Error handling
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Load balancing
    instance_var: 'INSTANCE_ID'
  }]
};