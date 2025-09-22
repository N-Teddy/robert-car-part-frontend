// src/utils/passwordStrength.ts
export interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    width: string;
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (!password) {
        return { score: 0, label: 'Empty', color: 'gray', width: '0%' };
    }

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Determine strength level
    if (score <= 2) {
        return { score, label: 'Weak', color: 'red', width: '33%' };
    } else if (score <= 4) {
        return { score, label: 'Medium', color: 'yellow', width: '66%' };
    } else {
        return { score, label: 'Strong', color: 'green', width: '100%' };
    }
};
