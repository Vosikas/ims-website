import type { Locale } from "@/app/[lang]/locales";
import type { NewsArticle } from "@/lib/news";

// Placeholder articles, to be deleted once WordPress is connected. They describe nothing real.

type SampleText = {
  title: string;
  excerpt: string;
  category: string;
  alt: string;
  contentHtml: string;
};

type Sample = {
  slug: string;
  date: string;
  imageSrc: string | null;
  text: Record<Locale, SampleText>;
};

const intro: Record<Locale, string> = {
  en: "<p>This is sample text showing how an article will look on the site. It will be replaced by real news once WordPress is connected.</p>",
  el: "<p>Αυτό είναι ενδεικτικό κείμενο που δείχνει πώς θα εμφανίζεται ένα άρθρο στον ιστότοπο. Θα αντικατασταθεί από πραγματικά νέα μόλις συνδεθεί το WordPress.</p>",
};

const samples: Sample[] = [
  {
    slug: "an-evening-of-music",
    date: "2026-10-28T16:00:00Z",
    imageSrc: "/images/home/news-events.jpg",
    text: {
      en: {
        title: "An evening of music on the school stage",
        excerpt:
          "Students from across the school came together for an evening of music, song and performance.",
        category: "Events",
        alt: "School performance on stage in front of a full auditorium",
        contentHtml: `
          <p>Concerts like this give students a chance to share what they have been working on, and to experience the focus and teamwork that a live performance demands.</p>
          <h2>What an article can include</h2>
          <p>Articles published from WordPress can use headings, lists, quotes, links and images, all styled to match the site:</p>
          <ul>
            <li>Headings that break a longer story into sections</li>
            <li>Lists like this one</li>
            <li><a href="/en/news">Links</a> to related pages</li>
          </ul>
          <blockquote>Quotes stand out from the text around them.</blockquote>
        `,
      },
      el: {
        title: "Μια βραδιά μουσικής στη σχολική σκηνή",
        excerpt:
          "Μαθητές από όλο το σχολείο ενώθηκαν σε μια βραδιά με μουσική, τραγούδι και παραστατικές τέχνες.",
        category: "Εκδηλώσεις",
        alt: "Σχολική παράσταση στη σκηνή μπροστά σε κατάμεστο αμφιθέατρο",
        contentHtml: `
          <p>Εκδηλώσεις όπως αυτή δίνουν στους μαθητές την ευκαιρία να μοιραστούν όσα έχουν δουλέψει και να βιώσουν τη συγκέντρωση και τη συνεργασία που απαιτεί μια ζωντανή παράσταση.</p>
          <h2>Τι μπορεί να περιλαμβάνει ένα άρθρο</h2>
          <p>Τα άρθρα που δημοσιεύονται από το WordPress μπορούν να έχουν επικεφαλίδες, λίστες, παραθέματα, συνδέσμους και εικόνες, όλα με την εμφάνιση του ιστότοπου:</p>
          <ul>
            <li>Επικεφαλίδες που χωρίζουν ένα μεγαλύτερο κείμενο σε ενότητες</li>
            <li>Λίστες σαν αυτή</li>
            <li><a href="/el/news">Συνδέσμους</a> προς σχετικές σελίδες</li>
          </ul>
          <blockquote>Τα παραθέματα ξεχωρίζουν από το υπόλοιπο κείμενο.</blockquote>
        `,
      },
    },
  },
  {
    slug: "a-new-season-for-school-teams",
    date: "2026-10-19T09:00:00Z",
    imageSrc: "/images/home/school-life.jpg",
    text: {
      en: {
        title: "A new season begins for our school teams",
        excerpt:
          "Training is under way as students return to the court for a new season of school sport.",
        category: "School Life",
        alt: "Students playing basketball on an outdoor court",
        contentHtml:
          "<p>School sport helps students build confidence, discipline and friendships that extend well beyond the game.</p>",
      },
      el: {
        title: "Μια νέα σεζόν ξεκινά για τις σχολικές μας ομάδες",
        excerpt:
          "Οι προπονήσεις ξεκίνησαν και οι μαθητές επιστρέφουν στο γήπεδο για μια νέα αθλητική σεζόν.",
        category: "Σχολική Ζωή",
        alt: "Μαθητές παίζουν μπάσκετ σε υπαίθριο γήπεδο",
        contentHtml:
          "<p>Ο σχολικός αθλητισμός βοηθά τους μαθητές να χτίσουν αυτοπεποίθηση, πειθαρχία και φιλίες που ξεπερνούν τα όρια του παιχνιδιού.</p>",
      },
    },
  },
  {
    slug: "discoveries-in-the-science-lab",
    date: "2026-10-08T09:00:00Z",
    imageSrc: "/images/home/middle-school.jpg",
    text: {
      en: {
        title: "Hands-on discoveries in the science lab",
        excerpt:
          "Students put theory into practice with experiments that make science easier to see and understand.",
        category: "Academics",
        alt: "Student looking through a microscope during a science lesson",
        contentHtml:
          "<p>Practical work encourages students to ask questions, test their ideas and learn from the results.</p>",
      },
      el: {
        title: "Πρακτικές ανακαλύψεις στο εργαστήριο φυσικών επιστημών",
        excerpt:
          "Οι μαθητές εφαρμόζουν τη θεωρία στην πράξη με πειράματα που κάνουν την επιστήμη πιο κατανοητή.",
        category: "Ακαδημαϊκά",
        alt: "Μαθητής κοιτάζει μέσα από μικροσκόπιο κατά τη διάρκεια μαθήματος φυσικών επιστημών",
        contentHtml:
          "<p>Η πρακτική εργασία ενθαρρύνει τους μαθητές να κάνουν ερωτήσεις, να δοκιμάζουν τις ιδέες τους και να μαθαίνουν από τα αποτελέσματα.</p>",
      },
    },
  },
  {
    slug: "getting-to-know-our-school",
    date: "2026-09-29T09:00:00Z",
    imageSrc: "/images/home/hero.jpg",
    text: {
      en: {
        title: "Getting to know our school",
        excerpt:
          "A look at how new families can explore the school and meet the people who make up our community.",
        category: "Admissions",
        alt: "Pupils with backpacks walking along a sunlit, tree-lined path towards the IMS school building",
        contentHtml:
          "<p>Visiting the school is often the best way to understand what daily life here is like and to ask any questions in person.</p>",
      },
      el: {
        title: "Γνωρίστε το σχολείο μας",
        excerpt:
          "Πώς οι νέες οικογένειες μπορούν να εξερευνήσουν το σχολείο και να γνωρίσουν τους ανθρώπους της κοινότητάς μας.",
        category: "Εγγραφές",
        alt: "Μαθητές με σακίδια περπατούν σε ηλιόλουστο, δεντρόφυτο μονοπάτι προς το κτίριο του σχολείου IMS",
        contentHtml:
          "<p>Μια επίσκεψη στο σχολείο είναι συχνά ο καλύτερος τρόπος για να καταλάβει κανείς πώς είναι η καθημερινότητά μας και να κάνει τις ερωτήσεις του από κοντά.</p>",
      },
    },
  },
  {
    slug: "creativity-in-the-early-years",
    date: "2026-09-24T09:00:00Z",
    imageSrc: "/images/home/kindergarten.jpg",
    text: {
      en: {
        title: "Creativity in the early years",
        excerpt:
          "Paint, colour and play help our youngest students explore the world and express themselves.",
        category: "Early Years",
        alt: "Smiling girl holding up hands covered in colourful paint",
        contentHtml:
          "<p>In the early years, creative activities support language, fine motor skills and confidence, all while feeling like play.</p>",
      },
      el: {
        title: "Δημιουργικότητα στα πρώτα χρόνια",
        excerpt:
          "Το χρώμα, η ζωγραφική και το παιχνίδι βοηθούν τους μικρότερους μαθητές μας να εξερευνούν τον κόσμο και να εκφράζονται.",
        category: "Πρώτα Χρόνια",
        alt: "Χαμογελαστό κορίτσι με χέρια βαμμένα σε πολύχρωμες μπογιές",
        contentHtml:
          "<p>Στα πρώτα χρόνια, οι δημιουργικές δραστηριότητες ενισχύουν τη γλώσσα, τη λεπτή κινητικότητα και την αυτοπεποίθηση, μέσα από το παιχνίδι.</p>",
      },
    },
  },
  {
    slug: "making-room-for-reading",
    date: "2026-09-17T09:00:00Z",
    imageSrc: "/images/home/ib-diploma.jpg",
    text: {
      en: {
        title: "Making room for reading",
        excerpt: "The school library is a place for students to read, research and work together.",
        category: "Academics",
        alt: "Three students working together at a library table",
        contentHtml:
          "<p>A good library supports independent study as much as group projects, and helps students build a lasting reading habit.</p>",
      },
      el: {
        title: "Χώρος για ανάγνωση",
        excerpt: "Η σχολική βιβλιοθήκη είναι ένας χώρος όπου οι μαθητές διαβάζουν, ερευνούν και συνεργάζονται.",
        category: "Ακαδημαϊκά",
        alt: "Τρεις μαθήτριες συνεργάζονται σε τραπέζι της βιβλιοθήκης",
        contentHtml:
          "<p>Μια καλή βιβλιοθήκη στηρίζει τόσο την ατομική μελέτη όσο και τις ομαδικές εργασίες, και βοηθά τους μαθητές να αποκτήσουν διαρκή συνήθεια ανάγνωσης.</p>",
      },
    },
  },
  {
    slug: "welcome-to-the-new-school-year",
    date: "2026-09-07T07:00:00Z",
    imageSrc: null,
    text: {
      en: {
        title: "Welcome to the new school year",
        excerpt: "A warm welcome to all our students and families as a new school year begins.",
        category: "School Life",
        alt: "",
        contentHtml: "<p>The start of the year is a time for new routines, new friendships and new goals.</p>",
      },
      el: {
        title: "Καλή σχολική χρονιά",
        excerpt: "Ένα θερμό καλωσόρισμα σε όλους τους μαθητές και τις οικογένειές μας για τη νέα σχολική χρονιά.",
        category: "Σχολική Ζωή",
        alt: "",
        contentHtml: "<p>Η αρχή της χρονιάς φέρνει νέες συνήθειες, νέες φιλίες και νέους στόχους.</p>",
      },
    },
  },
];

export function getSampleArticles(locale: Locale): NewsArticle[] {
  return samples.map(({ slug, date, imageSrc, text }) => {
    const { title, excerpt, category, alt, contentHtml } = text[locale];
    return {
      slug,
      title,
      excerpt,
      date,
      category,
      image: imageSrc ? { src: imageSrc, alt } : null,
      contentHtml: intro[locale] + contentHtml,
    };
  });
}
