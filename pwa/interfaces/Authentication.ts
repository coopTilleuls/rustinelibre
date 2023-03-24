export type AuthenticationResponse = {
  token: string;
  refresh_token: string;
};

export type ForgottenPasswordForm = {
  license: string;
};

export type NewPasswordForm = {
  password: string;
};
