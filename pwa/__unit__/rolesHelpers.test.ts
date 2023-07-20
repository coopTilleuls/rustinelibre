import {
  isAdmin,
  isBoss,
  isEmployee,
  isItinerant,
  isRepairerItinerant,
} from '@helpers/rolesHelpers';
import {Repairer} from '@interfaces/Repairer';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';
import {RepairerType} from '@interfaces/RepairerType';
import {User} from '@interfaces/User';

describe('Testing if user get ROLE_BOSS or not', () => {
  test("Should return true if the user has the 'ROLE_BOSS' role", () => {
    const partialUser: Partial<User> = {
      roles: ['ROLE_BOSS', 'ROLE_USER'],
    };
    expect(isBoss(partialUser as User)).toBeTruthy();
  });

  test("Should return false if the user does not have the 'ROLE_BOSS' role", () => {
    const partialUser: Partial<User> = {
      roles: ['ROLE_USER'],
    };
    expect(isBoss(partialUser as User)).toBeFalsy();
  });
});

describe('Testing if user get ROLE_EMPLOYEE or not', () => {
  test("Should return true if the user has the role 'ROLE_EMPLOYEE'", () => {
    const partialUser: Partial<User> = {
      roles: ['ROLE_EMPLOYEE', 'ROLE_USER'],
    };
    expect(isEmployee(partialUser as User)).toBeTruthy();
  });

  test("Should return false if the user does not have the 'ROLE_EMPLOYEE' role", () => {
    const partialUser: Partial<User> = {
      roles: ['ROLE_USER'],
    };
    expect(isEmployee(partialUser as User)).toBeFalsy();
  });
});

describe('Testing if user get ROLE_ADMIN or not', () => {
  test("Should return true if the user has the 'ROLE_ADMIN' role", () => {
    const partialUser: Partial<User> = {
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
    };
    expect(isAdmin(partialUser as User)).toBeTruthy();
  });

  test("Should return false if the user does not have the 'ROLE_ADMIN' role", () => {
    const partialUser: Partial<User> = {
      roles: ['ROLE_USER'],
    };
    expect(isAdmin(partialUser as User)).toBeFalsy();
  });
});

describe('Testing if repairer has roving repairer type', () => {
  test('Should return false if user has no repairer or repairerEmployee property', () => {
    const partialUser: Partial<User> = {};
    expect(isItinerant(partialUser as User)).toBeFalsy();
  });

  test("Should return true if the user has the repairer property and the type is 'roving'", () => {
    const partialRepairerType: Partial<RepairerType> = {
      name: 'itinérant',
    };
    const partialRepairer: Partial<Repairer> = {
      repairerType: partialRepairerType as RepairerType,
    };
    const partialUser: Partial<User> = {
      repairer: partialRepairer as Repairer,
    };
    expect(isItinerant(partialUser as User)).toBeTruthy();
  });

  test("Should return true if the user has the repairerEmployee property with repairer and the type is 'roving'", () => {
    const partialRepairerType: Partial<RepairerType> = {
      name: 'itinérant',
    };
    const partialRepairer: Partial<Repairer> = {
      repairerType: partialRepairerType as RepairerType,
    };
    const partialRepairerEmployee: Partial<RepairerEmployee> = {
      repairer: partialRepairer as Repairer,
    };
    const partialUser: Partial<User> = {
      repairerEmployee: partialRepairerEmployee as RepairerEmployee,
    };
    expect(isItinerant(partialUser as User)).toBeTruthy();
  });

  test("Should return true if the repairer has the 'roving' type", () => {
    const partialRepairerType: Partial<RepairerType> = {
      name: 'itinérant',
    };
    const partialRepairer: Partial<Repairer> = {
      repairerType: partialRepairerType as RepairerType,
    };
    expect(isRepairerItinerant(partialRepairer as Repairer)).toBeTruthy();
  });

  test("Should return false if the repairer does not have the 'roving' type", () => {
    const partialRepairerType: Partial<RepairerType> = {
      name: 'other type',
    };
    const partialRepairer: Partial<Repairer> = {
      repairerType: partialRepairerType as RepairerType,
    };
    expect(isRepairerItinerant(partialRepairer as Repairer)).toBeFalsy();
  });
});
