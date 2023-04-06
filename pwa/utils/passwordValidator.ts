export const validatePassword = (value: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?.+=;/:,_"&])[A-Za-z\d@$!%*#?.+=;,/:_"&]{12,}$/;
    if (!regex.test(value)) {
        return false;
    } else {
        return true;
    }
};