import {test, expect} from '@playwright/test';

test('authentication success', async ({page}) => {
  test.setTimeout(60000);
  await page.goto('/login');

  await page.getByRole('textbox', {name: 'email'}).fill('boss@test.com');
  await page.getByLabel('Mot de passe *').fill('Test1passwordOk!');
  await page.getByRole('button', {name: 'Se connecter'}).click();

  await expect(page).toHaveURL('/sradmin');
});
