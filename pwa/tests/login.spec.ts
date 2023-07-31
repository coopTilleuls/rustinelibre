import {test, expect} from '@playwright/test';

test('authentication success', async ({page}) => {
  await page.goto('/login');

  await page.getByRole('textbox', {name: 'email'}).fill('boss@test.com');
  await page.getByLabel('Mot de passe *').fill('Test1passwordOk!');
  await page.getByRole('button', {name: 'Se connecter'}).click();

  await expect(page, 'La page doit être redirigée vers /sradmin').toHaveURL('/sradmin');
});

test('authentication failed', async ({page}) => {
  await page.goto('/login');

  await page.getByRole('textbox', {name: 'email'}).fill('bad-email@test.com');
  await page.getByLabel('Mot de passe *').fill('bad-password');
  await page.getByRole('button', {name: 'Se connecter'}).click();

  await expect(page, 'La page doit rester sur /login').toHaveURL('/login');
  await expect(
    await page.getByText('Ces identifiants de connexion ne sont pas valides'),
    "Le message d'erreur doit être visible"
  ).toBeVisible();
});

test('can click on forgotten password link', async ({page}) => {
  await page.goto('/login');

  const forgottenPasswordLink = await page.getByRole('link', {
    name: 'Mot de passe oublié ?',
  });
  await expect(
    forgottenPasswordLink,
    'Le bouton "Mot de passe oublié ?" doit être visible'
  ).toBeVisible();
  await forgottenPasswordLink.click();

  await expect(
    page,
    'La page doit être redirigée vers /mot-de-passe-oublie'
  ).toHaveURL('/mot-de-passe-oublie');
});

test('can click on register link', async ({page}) => {
  await page.goto('/login');

  const registerLink = await page.getByRole('link', {
    name: 'S’inscrire',
  });
  await expect(
    registerLink,
    "Le bouton pour s'inscrire doit être visible"
  ).toBeVisible();
  await registerLink.click();

  await expect(page, 'La page doit être redirigée vers /inscription').toHaveURL(
    '/inscription'
  );
});
