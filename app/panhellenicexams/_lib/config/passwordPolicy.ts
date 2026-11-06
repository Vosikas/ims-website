// BACKEND-NEEDED[password-policy]: ο backend ελέγχει τον ίδιο κανόνα και έχει τον τελικό λόγο.
// Πότε: σε κάθε εγγραφή (και αργότερα στην αλλαγή κωδικού). Αν αλλάξει εκεί, αλλάζει και εδώ.
// Συμβόλαιο: docs/panhellenic/API_CONTRACT.md#password-policy
export const PASSWORD_POLICY = {
  minLength: 10,
  maxLength: 128,
} as const;
