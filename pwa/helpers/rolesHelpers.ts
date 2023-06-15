import {User} from "@interfaces/User";

export const isBoss = (user: User): boolean => {
    return user.roles.includes('ROLE_BOSS');
}

export const isEmployee = (user: User): boolean => {
    return user.roles.includes('ROLE_EMPLOYEE');
}
