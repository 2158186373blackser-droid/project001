// 弱密码黑名单
const weakPasswords = new Set([
  '12345678', 'password123', 'qwertyui', '123456789',
  '11111111', '123123123', 'password', '123456',
  'admin123', 'letmein', 'welcome1'
]);

// 验证用户名
export const validateUsername = (username) => {
  if (!username) return '请输入用户名';
  
  const trimmed = username.trim();
  if (trimmed.length < 3) return '用户名至少3个字符';
  if (trimmed.length > 20) return '用户名最多20个字符';
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(trimmed)) {
    return '用户名只能包含字母、数字和下划线';
  }
  
  return '';
};

// 验证邮箱（仅支持.edu.cn）
export const validateEmail = (email) => {
  if (!email) return '请输入邮箱';
  
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.edu\.cn$/;
  if (!emailRegex.test(email)) {
    return '请使用有效的.edu.cn邮箱';
  }
  
  return '';
};

// 验证密码强度
export const validatePassword = (password) => {
  if (!password) return '请输入密码';
  
  if (password.length < 8) return '密码长度至少为8位';
  
  if (!/[a-zA-Z]/.test(password)) return '密码必须包含字母';
  
  if (!/\d/.test(password)) return '密码必须包含数字';
  
  if (weakPasswords.has(password.toLowerCase())) {
    return '密码过于简单，请使用更复杂的密码';
  }
  
  return '';
};

// 验证确认密码
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return '请确认密码';
  
  if (password !== confirmPassword) return '两次输入的密码不一致';
  
  return '';
};

// 密码强度评分
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, text: '', class: '' };
  
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  
  if (weakPasswords.has(password.toLowerCase())) {
    return { score: 0, text: '弱密码', class: 'weak' };
  }
  
  if (score <= 2) return { score: 1, text: '弱', class: 'weak' };
  if (score <= 4) return { score: 2, text: '中', class: 'medium' };
  return { score: 3, text: '强', class: 'strong' };
};