# Συμβόλαιο API frontend–backend

Η μόνη πηγή αλήθειας για το τι χρειάζεται το frontend από τον backend και σε ποιο σημείο. Κάθε σημάδι `BACKEND-NEEDED[id]` στον κώδικα του frontend δείχνει σε μία ενότητα εδώ, και τα types του frontend (`app/panhellenicexams/_lib/api/types.ts`) ακολουθούν αυτό το έγγραφο.

## Γενικά

- **Διεύθυνση:** το frontend καλεί `/panhellenicexams/api/...`. Το site το προωθεί (rewrite στο `next.config.ts`) στο `/api/...` του backend. Ο browser βλέπει ένα μόνο origin, οπότε δεν χρειάζεται CORS.
- **Μορφή:** JSON με `Content-Type: application/json`, εκτός από τις απαντήσεις 204.
- **Session:** cookie που βάζει ο backend, `HttpOnly`, `SameSite=Lax`, `Path=/panhellenicexams`, και `Secure` από τη Φάση 2 με HTTPS. Το frontend δεν το βλέπει ποτέ· στέλνει μόνο `credentials: "include"`.
- **Μηνύματα:** το frontend δεν δείχνει ποτέ το `message` του backend. Δείχνει δικό του ελληνικό κείμενο ανάλογα με το `code` (`app/panhellenicexams/_lib/i18n/el.ts`).

### Κοινή μορφή σφάλματος

Κάθε σφάλμα του backend έχει αυτό το body:

```json
{ "code": "INVALID_CREDENTIALS", "message": "για τα logs μόνο", "fieldErrors": { "email": "INVALID_EMAIL" } }
```

| Πεδίο | Υποχρεωτικό | Τι είναι |
|---|---|---|
| `code` | ναι | Ένας από τους κωδικούς των ενοτήτων παρακάτω |
| `message` | όχι | Κείμενο για logs. Το frontend το αγνοεί |
| `fieldErrors` | όχι | Ανά πεδίο φόρμας, ένας από: `REQUIRED`, `INVALID_EMAIL`, `TOO_SHORT`, `TOO_LONG`, `MISMATCH`, `EMAIL_TAKEN`, `NOT_ACCEPTED` |

Ένα 5xx **χωρίς** JSON body το frontend το διαβάζει ως «δεν υπάρχει σύνδεση με τον server», γιατί έτσι απαντά ο proxy όταν ο backend δεν τρέχει.

### Πού είναι στον κώδικα (κάτω από `app/panhellenicexams/`)

| id | Η κλήση | Το σημείο στο UI |
|---|---|---|
| [session](#session) | `_lib/api/auth.real.ts` | `_views/LoginView.tsx`, όταν ανοίγει |
| [continue](#continue) | `_lib/api/auth.real.ts` | `_views/LoginView.tsx`, αν υπάρχει session |
| [login](#login) | `_lib/api/auth.real.ts` | `_views/LoginView.tsx`, κουμπί «Σύνδεση» |
| [signup](#signup) | `_lib/api/auth.real.ts` | `_views/SignupView.tsx`, κουμπί «Δημιουργία λογαριασμού» |
| [logout](#logout) | `_lib/api/auth.real.ts` | `_views/DevRedirectView.tsx`, κουμπί «Αποσύνδεση» |
| [csrf](#csrf) | `_lib/api/client.ts` | Κάθε POST |
| [redirect](#redirect) | `_lib/redirect.ts` | Μετά από login ή continue |
| [password-policy](#password-policy) | `_lib/config/passwordPolicy.ts` | Εγγραφή |
| [forgot-password](#forgot-password) | — | `forgot-password/page.tsx` |

---

## session

`GET /api/auth/session`

**Πότε:** μόλις ανοίγει η σελίδα σύνδεσης. Αν ο χρήστης είναι ήδη συνδεδεμένος, δεν του ζητάμε ξανά login.

**Request:** τίποτα, μόνο το cookie.

**Επιτυχία:** `200`

```json
{ "user": { "id": "u-123", "firstName": "Μαρία", "lastName": "Δημητρίου", "email": "maria@example.com", "role": "STUDENT" } }
```

`role` είναι ένα από `STUDENT`, `PARENT`, `TEACHER`, `ADMIN`.

**Σφάλματα:**

| HTTP | code | Τι κάνει το frontend |
|---|---|---|
| 401 | `UNAUTHENTICATED` (ή χωρίς body) | Δείχνει τη φόρμα, χωρίς μήνυμα |

**Ασφάλεια:** ποτέ κωδικός, hash ή token στην απάντηση. `Cache-Control: no-store`.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## continue

`POST /api/auth/continue`

**Πότε:** αμέσως μετά το [session](#session), όταν υπάρχει ήδη session. Ο χρήστης πάει στο eClass χωρίς να ξαναγράψει κωδικό.

**Request:**

```json
{ "app": "eclass" }
```

**Επιτυχία:** `200`, ίδια μορφή με το [login](#login):

```json
{ "redirectUrl": "http://ims-eclass.local/?ims_code=..." }
```

**Σφάλματα:**

| HTTP | code | Τι κάνει το frontend |
|---|---|---|
| 401 | `UNAUTHENTICATED` | Δείχνει τη φόρμα |
| 400 | `VALIDATION_ERROR` | Άγνωστο `app`. Δείχνει τη φόρμα |

**Ασφάλεια:** νέος κωδικός μίας χρήσης σε κάθε κλήση (δες [redirect](#redirect)). Θέλει [CSRF](#csrf).

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## login

`POST /api/auth/login`

**Πότε:** ο χρήστης πατά «Σύνδεση».

**Request:**

```json
{ "email": "maria@example.com", "password": "...", "rememberMe": false, "app": "eclass" }
```

**Επιτυχία:** `200` με `Set-Cookie` για το session και:

```json
{ "redirectUrl": "http://ims-eclass.local/?ims_code=..." }
```

Με `rememberMe: true` το session κρατά περισσότερο (π.χ. 30 μέρες). Χωρίς αυτό, λήγει όταν κλείσει ο browser.

**Σφάλματα:**

| HTTP | code | Τι δείχνει το frontend |
|---|---|---|
| 400 | `VALIDATION_ERROR` | «Ελέγξτε τα στοιχεία της φόρμας.» |
| 401 | `INVALID_CREDENTIALS` | «Λάθος email ή κωδικός.» |
| 403 | `ACCOUNT_PENDING` | «Ο λογαριασμός σας δεν έχει εγκριθεί ακόμα από τη γραμματεία.» |
| 423 | `ACCOUNT_LOCKED` | «Ο λογαριασμός σας είναι κλειδωμένος. Επικοινωνήστε με τη γραμματεία.» |
| 429 | `TOO_MANY_ATTEMPTS` | «…Δοκιμάστε ξανά σε N λεπτά.» από το header `Retry-After` (δευτερόλεπτα) |
| 403 | `CSRF_INVALID` | «Η σελίδα έληξε. Ανανεώστε τη και δοκιμάστε ξανά.» |

**Ασφάλεια:**
- Ίδια απάντηση για άγνωστο email και λάθος κωδικό.
- Ο κωδικός ελέγχεται **πριν** από την κατάσταση του λογαριασμού, ώστε `ACCOUNT_PENDING` και `ACCOUNT_LOCKED` να τα βλέπει μόνο όποιος ξέρει τον κωδικό.
- Όριο προσπαθειών ανά λογαριασμό και ανά IP.
- Νέο session id μετά από κάθε επιτυχημένο login.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## signup

`POST /api/auth/signup`

**Πότε:** ο χρήστης πατά «Δημιουργία λογαριασμού».

**Request:**

```json
{
  "firstName": "Άννα",
  "lastName": "Παπαδάκη",
  "email": "anna@example.com",
  "password": "...",
  "requestedRole": "PARENT",
  "acceptTerms": true
}
```

`requestedRole` είναι ένα από `STUDENT`, `PARENT`, `TEACHER`.

**Επιτυχία:** `201`, χωρίς session. Ο λογαριασμός περιμένει έγκριση.

```json
{ "status": "PENDING_APPROVAL" }
```

**Σφάλματα:**

| HTTP | code | Τι κάνει το frontend |
|---|---|---|
| 400 | `VALIDATION_ERROR` με `fieldErrors` | Μήνυμα κάτω από κάθε πεδίο, focus στο πρώτο |
| 409 | `EMAIL_TAKEN` με `fieldErrors: { "email": "EMAIL_TAKEN" }` | «Υπάρχει ήδη λογαριασμός με αυτό το email.» στο πεδίο email |

**Ασφάλεια:**
- Ο ρόλος είναι **αίτημα**. Τον δίνει η γραμματεία κατά την έγκριση. `ADMIN` δεν γίνεται δεκτό ποτέ.
- Κωδικοί μόνο με BCrypt ή Argon2.
- Ο ίδιος [κανόνας κωδικού](#password-policy) με το frontend.
- Το `EMAIL_TAKEN` αποκαλύπτει ποια email υπάρχουν. Στη Φάση 2 εξετάζουμε γενική απάντηση και ειδοποίηση με email.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## logout

`POST /api/auth/logout`

**Πότε:** ο χρήστης πατά «Αποσύνδεση». Τώρα στη σελίδα προσομοίωσης, αργότερα και από το eClass.

**Request:** τίποτα, μόνο το cookie.

**Επιτυχία:** `204`. Ο backend ακυρώνει το session στη βάση και σβήνει το cookie (`Max-Age=0`).

**Ασφάλεια:** Θέλει [CSRF](#csrf), ώστε άλλη σελίδα να μη μπορεί να αποσυνδέσει τον χρήστη.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## csrf

**Πότε:** σε κάθε POST (`continue`, `login`, `signup`, `logout`).

**Πρόταση:** double-submit cookie.
1. Ο backend βάζει cookie `XSRF-TOKEN` (όχι HttpOnly, `SameSite=Lax`, `Path=/panhellenicexams`).
2. Το frontend το διαβάζει και το στέλνει πίσω στο header `X-CSRF-Token`.
3. Ο backend συγκρίνει τα δύο.

Το frontend κάνει ήδη το βήμα 2 όταν βρει το cookie. Αν ο backend διαλέξει άλλα ονόματα (π.χ. με το CSRF extension του Quarkus), αλλάζουν στο `_lib/api/client.ts`.

**Σφάλμα:** `403 CSRF_INVALID` → «Η σελίδα έληξε. Ανανεώστε τη και δοκιμάστε ξανά.»

Κατάσταση: [x] θέση στο frontend · [ ] υλοποιήθηκε στο backend

## redirect

**Πότε:** μετά από επιτυχημένο [login](#login) ή [continue](#continue).

**Πώς το φτιάχνει ο backend:**
1. Βρίσκει τη διεύθυνση του `app` σε δική του λίστα (`eclass` → `http://ims-eclass.local/`). Δεν δέχεται ποτέ URL από τον browser.
2. Φτιάχνει τυχαίο κωδικό μίας χρήσης (τουλάχιστον 128 bits), που λήγει σε 60 δευτερόλεπτα, και τον αποθηκεύει μαζί με τον χρήστη και το `app`.
3. Επιστρέφει `<διεύθυνση>?ims_code=<κωδικός>`.

**Τι κάνει το frontend:** ακολουθεί το `redirectUrl` μόνο αν το origin του είναι στο `NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS`. Αλλιώς δείχνει «Η μεταφορά στο eClass σταμάτησε για λόγους ασφαλείας.» Στο mock mode πηγαίνει στη σελίδα προσομοίωσης `/panhellenicexams/dev/redirect`.

Κατάσταση: [x] mock στο frontend · [ ] υλοποιήθηκε στο backend

## password-policy

**Πότε:** σε κάθε εγγραφή, και αργότερα στην αλλαγή κωδικού.

**Κανόνας:** 10 έως 128 χαρακτήρες, χωρίς υποχρεωτικά σύμβολα ή κεφαλαία. Τα μεγάλα συνθηματικά προστατεύουν περισσότερο από τους κανόνες σύνθεσης.

Ο backend τον ελέγχει και έχει τον τελικό λόγο. Το frontend τον επαναλαμβάνει στο `_lib/config/passwordPolicy.ts` για άμεσο μήνυμα. Αν αλλάξει, αλλάζει και στα δύο.

**Φάση 2:** έλεγχος σε λίστα κωδικών που έχουν διαρρεύσει.

Κατάσταση: [x] στο frontend · [ ] υλοποιήθηκε στο backend

## forgot-password

**Φάση 2.** Η σελίδα υπάρχει ως ορατό placeholder, με απενεργοποιημένη φόρμα.

**Πρόταση:**
- `POST /api/auth/password-reset` `{ "email": "..." }` → πάντα `202`, ώστε να μη φαίνεται αν το email υπάρχει. Αν υπάρχει, στέλνεται email με σύνδεσμο που λήγει σε 30 λεπτά.
- `POST /api/auth/password-reset/confirm` `{ "token": "...", "password": "..." }` → `204`.

Κατάσταση: [ ] στο frontend · [ ] υλοποιήθηκε στο backend

---

## Όχι για το frontend

`POST /api/sso/exchange`

Το eClass (WordPress) ανταλλάσσει, **από server σε server**, τον κωδικό μίας χρήσης με τα στοιχεία του χρήστη. Ο browser δεν καλεί ποτέ αυτό το endpoint.

**Request:** με header `Authorization: Bearer <μυστικό του eClass>`, που το ξέρουν μόνο ο backend και το eClass.

```json
{ "code": "...", "app": "eclass" }
```

**Επιτυχία:** `200`, και ο κωδικός δεν ξαναδουλεύει.

```json
{ "user": { "id": "u-123", "firstName": "Μαρία", "lastName": "Δημητρίου", "email": "maria@example.com", "role": "STUDENT" } }
```

**Σφάλματα:** `400` για κωδικό άγνωστο, ληγμένο ή ήδη χρησιμοποιημένο. `401` για λάθος μυστικό.

Κατάσταση: [ ] υλοποιήθηκε στο backend · [ ] υλοποιήθηκε στο eClass
