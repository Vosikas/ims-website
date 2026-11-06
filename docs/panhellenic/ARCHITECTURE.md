# Αρχιτεκτονική

## Τα κομμάτια

| Κομμάτι | Πού | Τοπικά | Κρατά |
|---|---|---|---|
| Site και σελίδες login (Next.js 16) | repo `WEBSITE`, το login στο `app/panhellenicexams` | `localhost:3000` | Το δημόσιο site και τις οθόνες σύνδεσης/εγγραφής, κανένα δεδομένο χρήστη |
| Auth backend (Quarkus) | repo `BACKEND` | `localhost:8080` | Λογαριασμούς, ρόλους, sessions |
| Βάση του auth (PostgreSQL σε Docker) | repo `BACKEND` | `localhost:5432` | Τα δεδομένα του auth backend |
| eClass (WordPress στο Local) | εκτός αυτών των repos | `ims-eclass.local` | Μαθήματα, υλικό, εργασίες, βαθμούς (στη MySQL του WordPress) |

Οι λογαριασμοί ζουν μόνο στην PostgreSQL του auth backend. Το eClass δεν αποθηκεύει κωδικούς· εμπιστεύεται τον auth backend για το ποιος είναι ο χρήστης και τι ρόλο έχει.

## Μία διεύθυνση για τον χρήστη

Οι σελίδες login είναι μέρος του site, άρα ο χρήστης μένει πάντα στη διεύθυνσή του. Για να μιλάει με τον backend χωρίς CORS, το site προωθεί ένα path (`next.config.ts`):

| Path στο site | Πηγαίνει σε |
|---|---|
| `/panhellenicexams/api/*` | auth backend, `/api/*` |

Το cookie του session περιορίζεται στο `/panhellenicexams`, οπότε οι υπόλοιπες σελίδες του site δεν το βλέπουν.

## Η ροή του χρήστη

1. Ο χρήστης πατά την κάρτα «06 Γενικό Λύκειο» στην αρχική του site.
2. Ανοίγει το `/panhellenicexams` με τη σελίδα login. Αν έχει ήδη session, προχωρά κατευθείαν στο βήμα 4.
3. Κάνει login. Ο auth backend ελέγχει τα στοιχεία, βάζει cookie session και απαντά με `redirectUrl`.
4. Το `redirectUrl` είναι η διεύθυνση του eClass με έναν κωδικό μίας χρήσης που λήγει σε 60 δευτερόλεπτα.
5. Ο browser πηγαίνει στο eClass. Το eClass ανταλλάσσει τον κωδικό με τα στοιχεία και τον ρόλο του χρήστη, server προς server, και τον συνδέει.

Νέος χρήστης κάνει εγγραφή, ο λογαριασμός του μένει σε αναμονή, και τον ρόλο τον εγκρίνει η γραμματεία.

## Τοπικά τώρα και αργότερα

Στο MVP τα πάντα τρέχουν τοπικά και το login μπορεί να δουλέψει χωρίς backend (mock mode). Το online hosting του backend, το HTTPS και τα υπόλοιπα της ασφάλειας ανήκουν στη Φάση 2.
