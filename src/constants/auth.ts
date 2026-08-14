import { UI } from "@/constants/ui";
import { SITE_TAGLINE } from "@/constants/seo";

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.USER, label: "User" },
  { value: USER_ROLES.ADMIN, label: "Admin" },
] as const;

export const AUTH_PROVIDERS = {
  CREDENTIALS: "credentials",
  GOOGLE: "google",
} as const;

export const AUTH = {
  passwordMinLength: 6,
  nameMinLength: 2,
  bcryptRounds: 10,
} as const;

export const AUTH_COPY = {
  loginTitle: "Welcome back",
  loginSubtitle: "Sign in to track orders, checkout faster, and save your details.",
  registerTitle: "Create your account",
  registerSubtitle: "Join VS OilMill. New accounts start as customers.",
  googleContinue: "Continue with Google",
  orEmail: "or continue with email",
  signIn: "Sign in",
  signingIn: "Signing in…",
  register: "Create account",
  registering: "Creating…",
  noAccount: "No account?",
  createOne: "Create one",
  hasAccount: "Already have an account?",
  signInLink: "Sign in",
  name: "Full name",
  email: "Email",
  phone: "Phone",
  password: "Password",
  confirmPassword: "Confirm password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  passwordMismatch: "Passwords do not match",
  passwordHint: `At least ${AUTH.passwordMinLength} characters`,
  phoneOptional: "Optional",
  loading: "Loading…",
  redirecting: "Signing you in…",
  welcomeBack: "Welcome back",
  accountCreated: "Account created",
  invalidCredentials: "Invalid email or password",
  googleFailed: "Google sign-in failed. Please try again.",
  registerFailed: "Registration failed",
  backToStore: "Back to store",
  panelEyebrow: UI.since,
  panelHeadline: SITE_TAGLINE,
  panelBody:
    "Cold-pressed in our traditional mill — no heat, no chemicals, no compromise.",
  yearsLabel: "Years milling",
  familiesLabel: "Families served",
  ratingLabel: "Rated by customers",
} as const;

export const AUTH_HIGHLIGHTS = [
  { value: UI.trustYears, label: AUTH_COPY.yearsLabel },
  { value: UI.trustFamilies, label: AUTH_COPY.familiesLabel },
  { value: UI.trustRating, label: AUTH_COPY.ratingLabel },
] as const;

export const AUTH_ERRORS = {
  unauthorized: "Unauthorized",
  invalidInput: "Please check the form and try again",
  emailTaken: "Email already registered",
  userNotFound: "User not found",
  notFound: "Not found",
  cannotChangeOwnRole: "You cannot change your own role",
  cannotDeleteSelf: "You cannot delete your own account",
  lastAdmin: "Cannot demote the last admin",
  cannotDeleteLastAdmin: "Cannot delete the last admin",
  createFailed: "Failed to create user",
  updateFailed: "Failed to update user",
  registerFailed: "Register failed",
} as const;
