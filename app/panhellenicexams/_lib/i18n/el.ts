import type { ApiErrorCode, Role } from "../api/types";
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

  login: {
    title: "Σύνδεση",
    subtitle: "Μπείτε με τον αριθμό μητρώου και τον κωδικό σας.",
    registryNumber: "Αριθμός μητρώου",
    password: "Κωδικός",
    rememberMe: "Να με θυμάσαι",
    forgotPassword: "Ξεχάσατε τον κωδικό;",
    submit: "Σύνδεση",
    submitting: "Γίνεται σύνδεση…",
    noAccount: "Πρώτη φορά εδώ;",
    signupLink: "Δημιουργία λογαριασμού",
    checkingSession: "Έλεγχος σύνδεσης…",
    redirecting: "Μεταφορά στο eClass…",
  },

  signup: {
    title: "Δημιουργία λογαριασμού",
    stepsLabel: "Βήματα εγγραφής",
    steps: ["Αριθμός μητρώου", "Επιβεβαίωση", "Λογαριασμός"],
    continue: "Συνέχεια",
    continuing: "Παρακαλώ περιμένετε…",
    back: "Πίσω",
    haveAccount: "Έχετε ήδη λογαριασμό;",
    loginLink: "Σύνδεση",

    registrySubtitle: "Ξεκινήστε με τον αριθμό μητρώου που σας έδωσε το σχολείο.",
    registryNumber: "Αριθμός μητρώου",

    codeSubtitle: (email: string) => `Στείλαμε κωδικό επιβεβαίωσης στο ${email}.`,
    codeHint: "Είναι το email που έχει δηλώσει το σχολείο για αυτόν τον αριθμό μητρώου.",
    code: "Κωδικός επιβεβαίωσης",
    resend: "Δεν τον λάβατε; Αποστολή ξανά",
    resent: "Στείλαμε νέο κωδικό.",

    accountSubtitle: "Δηλώστε το email σας και διαλέξτε κωδικό πρόσβασης.",
    email: "Email",
    password: "Κωδικός πρόσβασης",
    passwordHint: `Τουλάχιστον ${PASSWORD_POLICY.minLength} χαρακτήρες. Μια φράση που θυμάστε εύκολα είναι καλή επιλογή.`,
    confirmPassword: "Επιβεβαίωση κωδικού",
    terms: "Αποδέχομαι τους όρους χρήσης και την πολιτική απορρήτου.",
    termsMore: "Πού είναι οι όροι;",
    termsPlaceholder:
      "Τα κείμενα των όρων χρήσης και της πολιτικής απορρήτου θα προστεθούν πριν από το πιλοτικό.",
    submit: "Ολοκλήρωση εγγραφής",
  },

  signupDone: {
    title: "Ο λογαριασμός σας είναι έτοιμος",
    subtitle: "Μπορείτε πλέον να συνδεθείτε με τον αριθμό μητρώου και τον κωδικό σας.",
    toLogin: "Μετάβαση στη σύνδεση",
  },

  forgotPassword: {
    title: "Επαναφορά κωδικού",
    subtitle: "Θα σας στέλνουμε σύνδεσμο για νέο κωδικό στο email σας.",
    phaseBadge: "Φάση 2",
    notYet:
      "Η επαναφορά κωδικού με email έρχεται στη Φάση 2. Μέχρι τότε, επικοινωνήστε με τη γραμματεία του σχολείου.",
    registryNumber: "Αριθμός μητρώου",
    submit: "Αποστολή συνδέσμου",
    backToLogin: "Επιστροφή στη σύνδεση",
  },

  devRedirect: {
    title: "Η σύνδεση πέτυχε",
    subtitle: "Προσομοίωση: εδώ τελειώνει το login και ξεκινά το eClass.",
    loading: "Φόρτωση…",
    name: "Όνομα",
    registryNumber: "Αριθμός μητρώου",
    role: "Ρόλος",
    wouldGo: "Με πραγματικό backend, ο browser θα πήγαινε τώρα εδώ:",
    codePlaceholder: "<κωδικός-μίας-χρήσης>",
    openEclass: "Άνοιγμα eClass σε νέα καρτέλα",
    openEclassHint: "Θα ανοίξει όταν στηθεί το eClass.",
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
    mockNow: "Τώρα: απαντήσεις mock από το _lib/api/auth.mock.ts, χωρίς κανέναν έλεγχο",
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

  apiErrors: {
    VALIDATION_ERROR: "Ελέγξτε τα στοιχεία της φόρμας.",
    UNAUTHENTICATED: "Η σύνδεσή σας έληξε. Συνδεθείτε ξανά.",
    INVALID_CREDENTIALS: "Λάθος αριθμός μητρώου ή κωδικός.",
    ACCOUNT_LOCKED: "Ο λογαριασμός σας είναι κλειδωμένος. Επικοινωνήστε με τη γραμματεία.",
    TOO_MANY_ATTEMPTS: "Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε λίγα λεπτά.",
    REGISTRY_NOT_FOUND: "Δεν βρέθηκε αυτός ο αριθμός μητρώου. Επικοινωνήστε με τη γραμματεία.",
    REGISTRY_ALREADY_USED: "Υπάρχει ήδη λογαριασμός με αυτόν τον αριθμό μητρώου.",
    CODE_INVALID: "Ο κωδικός επιβεβαίωσης δεν είναι σωστός.",
    CODE_EXPIRED: "Ο κωδικός επιβεβαίωσης έληξε. Ζητήστε νέο.",
    CSRF_INVALID: "Η σελίδα έληξε. Ανανεώστε τη και δοκιμάστε ξανά.",
    NETWORK_ERROR: "Δεν υπάρχει σύνδεση με τον server. Δοκιμάστε ξανά σε λίγο.",
    UNKNOWN: "Κάτι πήγε στραβά. Δοκιμάστε ξανά.",
    REDIRECT_BLOCKED:
      "Η μεταφορά στο eClass σταμάτησε για λόγους ασφαλείας. Επικοινωνήστε με τη γραμματεία.",
  } satisfies Record<MessageCode, string>,

  tooManyAttemptsIn: (minutes: number) =>
    `Πολλές αποτυχημένες προσπάθειες. Δοκιμάστε ξανά σε ${minutes} ${minutes === 1 ? "λεπτό" : "λεπτά"}.`,
};
