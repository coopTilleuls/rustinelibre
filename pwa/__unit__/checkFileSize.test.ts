import {checkFileSize} from '@helpers/checkFileSize';

describe('Testing the checkFileSize function', () => {
  test('Should return true if file size is less than or equal to 5 MB', () => {
    const file = new File([], 'test_file.png', {type: 'image/png'});
    // We simulate a 4 MB file
    Object.defineProperty(file, 'size', {value: 4 * 1024 * 1024});
    expect(checkFileSize(file)).toBeTruthy();
  });

  test('Should return false if file size is greater than 5 MB', () => {
    const file = new File([], 'test_file.png', {type: 'image/png'});
    // We simulate a 6 MB file
    Object.defineProperty(file, 'size', {value: 6 * 1024 * 1024});
    expect(checkFileSize(file)).toBeFalsy();
  });

  test('Should return true if file size is equal to 5 MB', () => {
    const file = new File([], 'test_file.png', {type: 'image/png'});
    // We simulate a 5 MB file
    Object.defineProperty(file, 'size', {value: 5 * 1024 * 1024});
    expect(checkFileSize(file)).toBeTruthy();
  });
});
