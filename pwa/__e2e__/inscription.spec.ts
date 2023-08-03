import {test, expect} from '@playwright/test';

test('register with good entries', async ({page}) => {
  await page.goto('/inscription');
  await page.waitForSelector('input[name="firstName"]');

  const randomString = (Math.random() + 1).toString(36).substring(7);

  // on remplit et soumet le formulaire
  await page.type('input[name="firstName"]', randomString);
  await page.type('input[name="lastName"]', randomString);
  await page.type('input[name="email"]', `${randomString}@test.com`);
  await page.type('input[name="password"]', 'Test1passwordOk!');
  await page.type('input[name="street"]', '50 rue des pommiers');
  await page.type('input[name="city"]', 'Lille');
  await page.click('button[type="submit"]');

  // on vérifie qu'un message indique qu'il faut entrer une code de validation
  const pendingCodeMessage = await page.getByText(
    'Veuillez indiquer le code de confirmation envoyé par email pour finaliser votre inscription.'
  );
  await expect(pendingCodeMessage).toBeVisible();

  // on vérifie que le champs pour entrer le code de validation est bien visible
  const codeInput = await page.locator('input[type="number"]');
  await expect(codeInput).toBeVisible();

  // on vérifie qu'un lien pou renvoyer le code de validation est bien visible
  const resendCodeText = await page.getByText(
    "Je n'ai pas reçu le code de validation, renvoyer."
  );
  await expect(resendCodeText).toBeVisible();

  // on vérifie que le bouton pour renvoyer le code de validation est bien visible et désactivé
  const submitButton = await page.locator('button:has-text("Valider")');
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeDisabled();

  // on vérifie qu'en entrant un code, le bouton se réactive
  await codeInput.fill('1234');
  await expect(submitButton).toBeEnabled();

  // on vérifie qu'en cliquant sur le bouton, un message d'erreur indique que le code est non valide
  await submitButton.click();
  const invalidCodeMessage = await page.getByText('Code non valide');
  await expect(invalidCodeMessage).toBeVisible();

  // on vérifie qu'en cliquant sur le texte pour renvoyer le code, un message indique que le code a bien été renvoyé
  await resendCodeText.click();
  const codeResentMessage = await page.getByText(
    'Code de confirmation renvoyé'
  );
  await expect(codeResentMessage).toBeVisible();
});

test('register with already used email', async ({page}) => {
  await page.goto('/inscription');
  await page.waitForSelector('input[name="firstName"]');

  // on remplit et soumet le formulaire
  await page.type('input[name="firstName"]', 'Boss');
  await page.type('input[name="lastName"]', 'Boss');
  await page.type('input[name="email"]', `boss@test.com`);
  await page.type('input[name="password"]', 'Test1passwordOk!');
  await page.type('input[name="street"]', '50 rue des pommiers');
  await page.type('input[name="city"]', 'Lille');
  await page.click('button[type="submit"]');

  const errorMessage = await page.getByText(
    'Un compte utilisant cet email existe déjà.'
  );
  await expect(errorMessage).toBeVisible();
});

test('register with bad password format', async ({page}) => {
  await page.goto('/inscription');
  await page.waitForSelector('input[name="firstName"]');

  const randomString = (Math.random() + 1).toString(36).substring(7);

  // on remplit et soumet le formulaire
  await page.type('input[name="firstName"]', randomString);
  await page.type('input[name="lastName"]', randomString);
  await page.type('input[name="email"]', `${randomString}@test.com`);
  await page.type('input[name="password"]', 'bad-password-format');
  await page.type('input[name="street"]', '50 rue des pommiers');
  await page.type('input[name="city"]', 'Lille');

  const button = await page.locator('button:has-text("Créer mon compte")');
  await expect(button).toBeDisabled();

  const errorMessage = await page.getByText(
    'Votre mot de passe doit contenir 12 caractères, une majuscule, un caractère spécial et des chiffres.'
  );
  await expect(errorMessage).toBeVisible();
});
