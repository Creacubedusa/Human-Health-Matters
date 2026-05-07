export interface DonorSignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type DonorSignUpErrors = Partial<Record<keyof DonorSignUpForm, string>>;

export interface DonorSignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface DonorLoginForm {
  email: string;
  password: string;
}

export type DonorLoginErrors = Partial<Record<keyof DonorLoginForm, string>>;

export interface DonorPasswordStrength {
  minLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasUpper: boolean;
  hasLower: boolean;
}
