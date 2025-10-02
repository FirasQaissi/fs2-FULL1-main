const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '..', 'logs');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getIsraelTime() {
    const now = new Date();
    const israelTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jerusalem"}
      ,
      ));
    return israelTime;
  }

  formatDateTime(date) {
    return date.toISOString().replace('T', ' ').replace('Z', '');
  }

  getLogFileName() {
    const today = this.getIsraelTime();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return `app-${dateStr}.log`;
  }

  writeLog(level, message, userId = null, action = null, additionalData = {}) {
    try {
      const timestamp = this.getIsraelTime();
      const logEntry = {
        timestamp: this.formatDateTime(timestamp),
        level: level.toUpperCase(),
        userId: userId || 'anonymous',
        action: action || 'unknown',
        message: message,
        ...additionalData
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      const logFile = path.join(this.logsDir, this.getLogFileName());
      
      fs.appendFileSync(logFile, logLine, 'utf8');
      
      // Also log to console for development
      console.log(`[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message} | User: ${logEntry.userId} | Action: ${logEntry.action}`);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  info(message, userId = null, action = null, additionalData = {}) {
    this.writeLog('info', message, userId, action, additionalData);
  }

  warn(message, userId = null, action = null, additionalData = {}) {
    this.writeLog('warn', message, userId, action, additionalData);
  }

  error(message, userId = null, action = null, additionalData = {}) {
    this.writeLog('error', message, userId, action, additionalData);
  }

  debug(message, userId = null, action = null, additionalData = {}) {
    this.writeLog('debug', message, userId, action, additionalData);
  }

  // Specific logging methods for common actions
  userLogin(userId, email, ip = null) {
    this.info(`User logged in: ${email}`, userId, 'LOGIN', { email, ip });
  }

  userLogout(userId, email) {
    this.info(`User logged out: ${email}`, userId, 'LOGOUT', { email });
  }

  userRegister(userId, email) {
    this.info(`New user registered: ${email}`, userId, 'REGISTER', { email });
  }

  adminAction(userId, action, targetId = null, details = {}) {
    this.info(`Admin action: ${action}`, userId, 'ADMIN_ACTION', { action, targetId, ...details });
  }

  productAction(userId, action, productId = null, details = {}) {
    this.info(`Product action: ${action}`, userId, 'PRODUCT_ACTION', { action, productId, ...details });
  }

  customerMessage(userId, messageId, action, details = {}) {
    this.info(`Customer message: ${action}`, userId, 'CUSTOMER_MESSAGE', { messageId, action, ...details });
  }

  systemEvent(event, details = {}) {
    this.info(`System event: ${event}`, null, 'SYSTEM', { event, ...details });
  }

  securityEvent(event, userId = null, details = {}) {
    this.warn(`Security event: ${event}`, userId, 'SECURITY', { event, ...details });
  }
}

module.exports = new Logger();
