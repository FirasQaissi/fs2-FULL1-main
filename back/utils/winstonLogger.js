const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
require('fs').mkdirSync(logsDir, { recursive: true });

// Custom format for logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'smartgate-backend' },
  transports: [
    // Console transport for development and Render logs
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat
    }),
    
    // File transport for all logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat
    }),
    
    // Error file transport
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat
    })
  ],
  
  // Handle uncaught exceptions and unhandled rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'exceptions.log'),
      format: logFormat
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logsDir, 'rejections.log'),
      format: logFormat
    })
  ]
});

// Add custom methods for structured logging
logger.userLogin = (userId, email, ip = null) => {
  logger.info('User login', { 
    userId, 
    email, 
    ip, 
    action: 'LOGIN',
    timestamp: new Date().toISOString()
  });
};

logger.userLogout = (userId, email) => {
  logger.info('User logout', { 
    userId, 
    email, 
    action: 'LOGOUT',
    timestamp: new Date().toISOString()
  });
};

logger.userRegister = (userId, email) => {
  logger.info('User registration', { 
    userId, 
    email, 
    action: 'REGISTER',
    timestamp: new Date().toISOString()
  });
};

logger.httpRequest = (method, path, ip, userAgent) => {
  logger.info('HTTP Request', {
    method,
    path,
    ip,
    userAgent,
    action: 'HTTP_REQUEST',
    timestamp: new Date().toISOString()
  });
};

logger.httpResponse = (method, path, statusCode, duration, ip) => {
  logger.info('HTTP Response', {
    method,
    path,
    statusCode,
    duration,
    ip,
    action: 'HTTP_RESPONSE',
    timestamp: new Date().toISOString()
  });
};

logger.leadCreated = (leadId, name, phone, source, hasPhoto) => {
  logger.info('Lead created', {
    leadId,
    name,
    phone,
    source,
    hasPhoto,
    action: 'LEAD_CREATED',
    timestamp: new Date().toISOString()
  });
};

logger.securityEvent = (event, userId, details) => {
  logger.warn('Security event', {
    event,
    userId,
    ...details,
    action: 'SECURITY',
    timestamp: new Date().toISOString()
  });
};

module.exports = logger;
