import type { ApiErrorCode, FieldErrorCode, RequestableRole, Role } from "../api/types";
import { PASSWORD_POLICY } from "../config/passwordPolicy";

/** Codes the frontend shows a message for: the API's, plus one of its own. */
export type MessageCode = ApiErrorCode | "REDIRECT_BLOCKED";

export const el = {
  meta: {
    titleTemplate: "%s | Πανελλήνιες | IMS",
    defaultTitle: "Πανελλήνιες | IMS",
  },

  layout: {
    schoolName: "IMS International Metropolitan School",
    logoLabel: "IMS International Metropolitan School, αρχική σελίδα",
    platform: "Πλατφόρμα Πανελληνίων",
    lyceum: "Γενικό Λύκειο",
    taglineFirst: "Καλλιεργούμε πνεύματα.",
    taglineSecond: "Διαμορφώνουμε μέλλον.",
    backToSite: "Επιστροφή στην ιστοσελίδα",
  },

  fields: {
    required: "(υποχρεωτικό)",
    showPassword: "Εμφάνιση κωδικού",
    capsLock: "Το Caps Lock είναι ενεργό.",
  },

  errorSummaryTitle: "Διορθώστε τα παρακάτω για να συνεχίσετε:",

  login: {
    title: "Σύνδεση",
    subtitle: "Μπείτε με τον λογαριασμό σας στην πλατφόρμα των Πανελληνίων.",
    email: "Email",
    password: "Κωδικός",
    rememberMe: "Να με θυμάσαι",
    forgotPassword: "Ξεχάσατε τον κωδικό;",
    submit: "Σύνδεση",
    submitting: "Γίνεται σύνδεση…",
    noAccount: "Δεν έχετε λογαριασμό;",
    signupLink: "Εγγραφή",
    checkingSession: "Έλεγχος σύνδεσης…",
    redirecting: "Μεταφορά στο eClass…",
  },

  signup: {
    title: "Δημιουργία λογαριασμού",
    subtitle: "Ζητήστε πρόσβαση στην πλατφόρμα των Πανελληνίων.",
    allRequired: "Όλα τα πεδία είναι υποχρεωτικά.",
    firstName: "Όνομα",
    lastName: "Επώνυμο",
    email: "Email",
    roleLegend: "Ρόλος που ζητάτε",
    roleHint: "Ο ρόλος εγκρίνεται από τη γραμματεία του σχολείου.",
    parentNote: "Τη σύνδεση με το παιδί σας την κάνει η γραμματεία, μετά την έγκριση.",
    password: "Κωδικός",
    passwordHint: `Τουλάχιστον ${PASSWORD_POLICY.minLength} χαρακτήρες. Μια φράση που θυμάστε εύκολα είναι καλή επιλογή.`,
    confirmPassword: "Επιβεβαίωση κωδικού",
    terms: "Αποδέχομαι τους όρους χρήσης και την πολιτική απορρήτου.",
    termsMore: "Πού είναι οι όροι;",
    termsPlaceholder:
      "Τα κείμενα των όρων χρήσης και της πολιτικής απορρήτου θα προστεθούν πριν από το πιλοτικό.",
    submit: "Δημιουργία λογαριασμού",
    submitting: "Αποστολή…",
    haveAccount: "Έχετε ήδη λογαριασμό;",
    loginLink: "Σύνδεση",
    roleRequired: "Επιλέξτε τον ρόλο που ζητάτε.",
    termsRequired: "Για να συνεχίσετε, αποδεχτείτε τους όρους.",
  },

  pending: {
    title: "Ο λογαριασμός σας περιμένει έγκριση",
    receivedFor: (email: string) => `Λάβαμε το αίτημα για το ${email}.`,
    received: "Λάβαμε το αίτημά σας.",
    stepsLabel: "Τι ακολουθεί",
    steps: [
      { text: "Λάβαμε το αίτημά σας", status: "Ολοκληρώθηκε" },
      { text: "Η γραμματεία ελέγχει τα στοιχεία και τον ρόλο σας", status: "Σε εξέλιξη" },
      { text: "Συνδέεστε στην πλατφόρμα", status: "Επόμενο" },
    ],
    afterApproval:
      "Μόλις εγκριθεί ο λογαριασμός, θα μπορείτε να συνδεθείτε με το email και τον κωδικό σας.",
    backToLogin: "Επιστροφή στη σύνδεση",
  },

  forgotPassword: {
    title: "Επαναφορά κωδικού",
    subtitle: "Θα σας στέλνουμε σύνδεσμο για νέο κωδικό στο email σας.",
    phaseBadge: "Φάση 2",
    notYet:
      "Η επαναφορά κωδικού με email έρχεται στη Φάση 2. Μέχρι τότε, επικοινωνήστε με τη γραμματεία του σχολείου.",
    email: "Email",
    submit: "Αποστολή συνδέσμου",
    backToLogin: "Επιστροφή στη σύνδεση",
  },

  devRedirect: {
    title: "Η σύνδεση πέτυχε",
    subtitle: "Προσομοίωση: εδώ τελειώνει το login και ξεκινά το eClass.",
    loading: "Φόρτωση…",
    name: "Όνομα",
    email: "Email",
    role: "Ρόλος",
    wouldGo: "Με πραγματικό backend, ο browser θα πήγαινε τώρα εδώ:",
    codePlaceholder: "<κωδικός-μίας-χρήσης>",
    openEclass: "Άνοιγμα eClass σε νέα καρτέλα",
    openEclassHint: "Θα ανοίξει όταν στηθεί το WordPress στο Local.",
    logout: "Αποσύνδεση",
    loggingOut: "Αποσύνδεση…",
  },

  notFound: {
    title: "Η σελίδα δεν βρέθηκε",
    subtitle: "Ο σύνδεσμος που ακολουθήσατε δεν υπάρχει.",
    backToLogin: "Μετάβαση στη σύνδεση",
  },

  backendNote: {
    title: "Χρειάζεται backend",
    mockNow: "Τώρα: απαντήσεις mock από το _lib/api/auth.mock.ts",
    realNow: "Τώρα: πραγματικός backend",
    contract: "Συμβόλαιο:",
    mockBadge: "MOCK API",
    mockBadgeTitle: "Οι απαντήσεις είναι προσομοίωση. Δεν υπάρχει backend ακόμα.",
  },

  roles: {
    STUDENT: "Μαθητής/τρια",
    PARENT: "Γονέας",
    TEACHER: "Καθηγητής/τρια",
    ADMIN: "Γραμματεία",
  } satisfies Record<Role, string>,

  roleDescriptions: {
    STUDENT: "Υλικό, εργασίες και οι βαθμοί μου.",
    PARENT: "Η πρόοδος του παιδιού μου.",
    TEACHER: "Υλικό, εργασίες και βαθμοί των τμημάτων μου.",
  } satisfies Record<RequestableRole, string>,

  apiErrors: {
    VALIDATION_ERROR: "Ελέγξτε τα στοιχεία της φόρμας.",
    UNAUTHENTICATED: "Η σύνδεσή σας έληξε. Συνδεθείτε ξανά.",
    INVALID_CREDENTIALS: "Λάθος email ή κωδικός.",
    ACCOUNT_PENDING: "Ο λογαριασμός σας δεν έχει εγκριθεί ακόμα από τη γραμματεία.",
    ACCOUNT_LOCKED: "Ο λογαριασμός σας είναι κλειδωμένος. Επικοινωνήστε με τη γραμματεία.",
    TOO_MANY_ATTEMPTS: "Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε λίγα λεπτά.",
    EMAIL_TAKEN: "Υπάρχει ήδη λογαριασμός με αυτό το email.",
    CSRF_INVALID: "Η σελίδα έληξε. Ανανεώστε τη και δοκιμάστε ξανά.",
    NETWORK_ERROR: "Δεν υπάρχει σύνδεση με τον server. Δοκιμάστε ξανά σε λίγο.",
    UNKNOWN: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
    REDIRECT_BLOCKED:
      "Η μεταφορά στο eClass σταμάτησε για λόγους ασφαλείας. Επικοινωνήστε με τη γραμματεία.",
  } satisfies Record<MessageCode, string>,

  tooManyAttemptsIn: (minutes: number) =>
    `Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε ${minutes} ${minutes === 1 ? "λεπτό" : "λεπτά"}.`,

  fieldError(code: FieldErrorCode, label: string): string {
    switch (code) {
      case "REQUIRED":
        return `Συμπληρώστε το πεδίο «${label}».`;
      case "INVALID_EMAIL":
        return "Γράψτε ένα έγκυρο email, π.χ. onoma@example.com.";
      case "TOO_SHORT":
        return `Ο κωδικός χρειάζεται τουλάχιστον ${PASSWORD_POLICY.minLength} χαρακτήρες.`;
      case "TOO_LONG":
        return `Ο κωδικός μπορεί να έχει έως ${PASSWORD_POLICY.maxLength} χαρακτήρες.`;
      case "MISMATCH":
        return "Οι δύο κωδικοί δεν ταιριάζουν.";
      case "EMAIL_TAKEN":
        return "Υπάρχει ήδη λογαριασμός με αυτό το email.";
      case "NOT_ACCEPTED":
        return "Για να συνεχίσετε, αποδεχτείτε τους όρους.";
    }
  },
};
