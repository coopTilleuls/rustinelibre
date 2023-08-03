import {test, expect} from '@playwright/test';

test('request with know email', async ({page}) => {
  await page.goto('/mot-de-passe-oublie');

  await page.getByRole('textbox', {name: 'email'}).fill('boss@test.com');
  await page.getByRole('button', {name: 'Envoyer'}).click();

  const successMessage = await page.getByText(
    'Veuillez consulter vos emails pour mettre à jour votre mot de passe.'
  );

  await expect(successMessage).toBeVisible();
});

test('request with unknow email', async ({page}) => {
  await page.goto('/mot-de-passe-oublie');

  await page.getByRole('textbox', {name: 'email'}).fill('bad-email@test.com');
  await page.getByRole('button', {name: 'Envoyer'}).click();

  const errorMessage = await page.getByText(
    "Cet email n'est pas inscrit sur notre plateforme"
  );

  await expect(errorMessage).toBeVisible();
});
