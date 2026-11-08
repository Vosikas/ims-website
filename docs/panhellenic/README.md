# Πανελλήνιες: login και εγγραφή

Οι σελίδες σύνδεσης και εγγραφής της πλατφόρμας Πανελληνίων. Είναι μέρος του site, στο `/panhellenicexams`, και ο χρήστης φτάνει εκεί από την κάρτα «06 Γενικό Λύκειο» της αρχικής.

Ο auth backend (Quarkus και PostgreSQL) είναι ξεχωριστό repo, στον φάκελο `BACKEND` δίπλα στο `WEBSITE`. Μέχρι να υπάρξει, οι σελίδες δουλεύουν με mock απαντήσεις.

## Έγγραφα

- [Αρχιτεκτονική](ARCHITECTURE.md): τα κομμάτια, τα ports και η ροή του χρήστη.
- [Συμβόλαιο API](API_CONTRACT.md): τι χρειάζεται το frontend από τον backend και σε ποιο σημείο.
- [Αποφάσεις](DECISIONS.md): τι αποφασίσαμε και γιατί.

## Πώς τρέχει

Στο `WEBSITE`:

```bash
npm run dev
```

Άνοιξε το http://localhost:3000/el και πάτα την κάρτα «Γενικό Λύκειο». Ανοίγει το http://localhost:3000/panhellenicexams.

## Ρυθμίσεις

Σε ένα `.env.local` στο `WEBSITE`. Χωρίς αρχείο ισχύουν τα defaults.

| Μεταβλητή | Default | Τι κάνει |
|---|---|---|
| `NEXT_PUBLIC_PANHELLENIC_API_MODE` | `mock` | `mock`: απαντήσεις από το `_lib/api/auth.mock.ts`. `real`: κλήσεις στον backend |
| `PANHELLENIC_API_URL` | `http://localhost:8080` μόνο στο dev | Πού προωθείται το `/panhellenicexams/api` |
| `NEXT_PUBLIC_ECLASS_URL` | `http://ims-eclass.local` | Η αρχική του eClass (WordPress στο Local) |
| `NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS` | `http://ims-eclass.local` | Τα μόνα origins όπου επιτρέπεται να στείλει τον browser το `redirectUrl` (χωρισμένα με κόμμα) |
| `NEXT_PUBLIC_SHOW_BACKEND_NOTES` | ναι, μόνο στο dev | `false` κρύβει τα πορτοκαλί κουτιά και το badge MOCK. Στο production build δεν φαίνονται ποτέ |

## Για την παρουσίαση (mock)

Προς το παρόν **δεν ελέγχεται τίποτα**: κάθε αριθμός μητρώου και κωδικός περνά, ακόμα και κενά. Ο αριθμός μητρώου διαλέγει μόνο με ποιον ρόλο θα μπεις. Τα πρόσωπα είναι φανταστικά.

| Αριθμός μητρώου | Ρόλος |
|---|---|
| `1001` ή οποιοσδήποτε άλλος | Μαθήτρια |
| `2001` | Γονέας |
| `3001` | Καθηγητής |

Η εγγραφή έχει τρία βήματα: αριθμός μητρώου, κωδικός επιβεβαίωσης, email και κωδικός πρόσβασης. Κάθε τιμή περνά, και στο τέλος εμφανίζεται η σελίδα «Ο λογαριασμός σας είναι έτοιμος».

Μετά τη σύνδεση ανοίγει το `/panhellenicexams/dev/redirect`. Δείχνει πού θα πήγαινε ο browser με πραγματικό backend, και υπάρχει μόνο σε mock mode. Το mock κρατά τη σύνδεση στη μνήμη του browser, οπότε ένα refresh σε αποσυνδέει.

## Τι χρειάζεται από τον backend

Τρία σημάδια, που δείχνουν στο [συμβόλαιο API](API_CONTRACT.md):

- **Στον κώδικα:** σχόλια `BACKEND-NEEDED[id]`. Βρίσκονται στο Todo Tree του VS Code ή με την εντολή:

  ```bash
  grep -rn "BACKEND-NEEDED" app/panhellenicexams
  ```

- **Στην οθόνη:** πορτοκαλί κουτιά «Χρειάζεται backend» κάτω από κάθε φόρμα, και το badge «MOCK API». Μόνο στο dev.
- **Στο συμβόλαιο:** μία ενότητα για κάθε id, με τσεκ κατάστασης.

## Δομή

```
app/panhellenicexams/
├── layout.tsx          δικό του root layout: ίδιες γραμματοσειρές και χρώματα με το site, χωρίς header/footer
├── panhellenic.css     ό,τι διαφέρει από το globals.css
├── page.tsx            /panhellenicexams (σύνδεση)
├── signup/             εγγραφή σε τρία βήματα και signup/done (ολοκλήρωση)
├── forgot-password/    placeholder της Φάσης 2
├── dev/redirect/       προσομοίωση του redirect, μόνο σε mock
├── not-found.tsx       404 με την εμφάνιση του login, και [...missing] για τα άγνωστα paths
├── _views/             οι οθόνες με state (client components)
├── _components/        φόρμες, layout, σημειώσεις backend
└── _lib/
    ├── api/            όλη η επικοινωνία με τον server (types, client, mock, real)
    ├── config/         env, app, κανόνας κωδικού
    ├── i18n/el.ts      όλα τα κείμενα και τα μηνύματα σφαλμάτων
    └── …               redirect, routes, styles
```

Οι φάκελοι με `_` δεν γίνονται routes. Από το υπόλοιπο site χρησιμοποιούνται το λογότυπο (`components/logo.tsx`), οι γραμματοσειρές (`lib/fonts.ts`), τα χρώματα (`app/globals.css`) και η φωτογραφία του Γενικού Λυκείου.

## Ασφάλεια στο frontend

- Ποτέ tokens ή κωδικοί σε `localStorage` ή `sessionStorage`. Το session είναι httpOnly cookie του backend.
- Κανένα URL επιστροφής από τη διεύθυνση. Το frontend στέλνει μόνο `app: "eclass"`, και ακολουθεί το `redirectUrl` του backend μόνο προς τα origins του `NEXT_PUBLIC_ALLOWED_REDIRECT_ORIGINS`.
- Τα μηνύματα σφάλματος είναι δικά μας, ποτέ αυτούσια από τον backend.
- Οι φόρμες αδειάζουν τον κωδικό μόλις πετύχει η σύνδεση ή η εγγραφή, γιατί το Next.js κρατά τις σελίδες κρυμμένες στη μνήμη.
