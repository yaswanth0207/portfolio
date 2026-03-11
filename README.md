# Yaswanth Chowdary Medarametla - AI Engineer Portfolio

A single-page, dark-themed portfolio website for an **AI/LLM Engineer** showcasing production-ready RAG systems, multi-agent architectures, and data-centric AI projects. Built with **semantic HTML**, **modern CSS (glassmorphism + gradients)**, and **vanilla JavaScript**—no frameworks required.

## Features

- **Modern dark UI** with glassmorphism cards, cyan–purple gradients, and smooth transitions  
- **Fully responsive** layout for mobile (375px), tablet (768px), and desktop (1440px)  
- **Sticky navbar** with transparent-to-solid scroll behavior and active section highlighting  
- **Hero section** with:
  - Typing animation cycling through key roles (e.g., *RAG Systems Expert*)  
  - Subtle **canvas-based particle background**  
  - Primary and secondary call-to-action buttons  
- **About section** with bio, stat cards, and technology stack overview  
- **Projects section** with:
  - Three detailed AI project cards (Agentic RAG Chatbot, CodeLens, AI Data Analyst Agent)  
  - Hover scale + glow effects and tech stack tags  
  - Optional **project filters**: All / RAG / Agents / Data  
  - **Case Study modal** for each project with overview, architecture placeholder, metrics, challenges, and links  
- **Skills section** with:
  - Technical skills grid (LLM frameworks, vector DBs, data engineering, evaluation, web frameworks)  
  - Vertical **achievements timeline**  
- **Contact section** with:
  - Direct contact info (email, LinkedIn, GitHub, location)  
  - Social icon links  
  - Simple contact form (mailto-based, no backend)  
- **Footer** with quick links, copyright, and back-to-top button  
- **Accessibility-minded**: semantic structure, skip link, focus states, ARIA labels, and color contrast-conscious design

## Project Structure

```text
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   │   └── README.md
│   └── docs/
│       └── Yaswanth_Resume.pdf
└── README.md
```

## How to Run Locally

1. **Clone or copy** this folder to your machine.  
2. Open the root folder (`portfolio/`).  
3. Simply open `index.html` in any modern browser:

   - Double-click `index.html`, or  
   - Right-click → “Open With” → your browser of choice.

No build tools, package managers, or servers are required.

> Tip: For best results during development, you can use a simple static server (e.g., VS Code Live Server, `python -m http.server`, or `npx serve`) to avoid any asset path issues.

## How to Customize

### 1. Update Personal Information

- **Name & logo text**:  
  Edit the branding text in the header in `index.html`.
- **Location** and **headline** (hero section):  
  Update the hero copy under the `#hero` section.
- **Contact email & social links**:  
  Search for `yaswanthmedarametla2@gmail.com` and `<!-- Add actual URL -->` in `index.html` and replace with your real links:
  - LinkedIn profile URL  
  - GitHub profile URL  
  - (Optional) Twitter/X URL

### 2. Update Hero Typing Animation

- In `js/main.js`, look for the `typingPhrases` array:

  ```js
  const typingPhrases = [
    "RAG Systems Expert",
    "Multi-Agent Architect",
    "Hackathon Winner",
    "Data + AI Engineer",
  ];
  ```

- Replace the strings with any phrases that best describe your expertise. The typing loop automatically cycles through them.

### 3. Edit About & Stats

- In `index.html`, under the `#about` section:
  - Update the **bio paragraph** to reflect your exact experience.  
  - Adjust the **stat cards** (values and labels) to match your current metrics (projects, scores, achievements).

### 4. Customize Projects

- Each project card is defined in the **Projects** section of `index.html` under `#projects`.  
- For each project:
  - Update the **badge**, **title**, **subtitle**, **description**, **features list**, **metrics**, and **tech stack tags**.
  - Replace `href="#"` on **Live Demo** and **GitHub** buttons with real URLs.
- The **Case Study modal content** is defined in `js/main.js` in the `projectData` object.  
  Update:
  - `badge`, `title`, `subtitle`, `description`  
  - Arrays for `features`, `metrics`, and `challenges`  
  - `links.demo`, `links.github`, `links.blog` for each project key.

### 5. Skills & Timeline

- Under the `#skills` section in `index.html`:
  - Edit the **skills cards** to match your stack.  
  - Modify the **timeline items** (dates, emojis, descriptions) to reflect your real achievements and career history.

### 6. Contact Form Behavior

- The contact form uses a `mailto:` action:

  ```html
  <form
    class="contact-form"
    action="mailto:yaswanthmedarametla2@gmail.com"
    method="GET"
  >
  ```

- Replace the email with your own to have the **Send Message** button open the user’s email client pre-filled with their message.

## Adding Project Screenshots

- Place your screenshots into `assets/images/` and follow the guidelines in `assets/images/README.md`.  
  Suggested sizes:
  - Project screenshots: **800x600px** (PNG or JPG)  
  - Architecture diagrams: **1200x800px** (PNG or SVG)  
  - Open Graph image: **1200x630px** (`og-image.png`)  
  - Favicon: **32x32px** or **64x64px** (`favicon.png`)

- Update any `<img>` tags or background image references you add to `index.html` or `style.css` to point to your new files.

## Resume

- A placeholder file, `assets/docs/Yaswanth_Resume.pdf`, is included.  
- Replace it with your actual resume:

  1. Delete the placeholder file.  
  2. Add your real PDF with the **same filename** (`Yaswanth_Resume.pdf`) so the download link continues to work.

## Deployment

This is a static site; you can deploy it easily to any static hosting provider.

### GitHub Pages

1. Create a new GitHub repository and push the contents of `portfolio/` to it.  
2. In your repo settings, enable **GitHub Pages** (e.g., `main` branch, `/root`).  
3. After it builds, your site will be available at a `github.io` URL.

### Netlify

1. Log in to Netlify and click **New site from Git**.  
2. Connect the repo containing this portfolio.  
3. Build command: _none_ (static)  
4. Publish directory: `/` (repo root containing `index.html`).  
5. Deploy and use the generated URL or add a custom domain.

### Vercel

1. Log in to Vercel and import the GitHub repository.  
2. Framework preset: **Other** (or static).  
3. Build command: _none_; Output directory: `/`.  
4. Deploy and configure your domain as needed.

## Performance & Best Practices

- Styles are written with **mobile-first** responsive design and use efficient properties (`transform`, `opacity`) for animations.  
- Images should be compressed and served at appropriate sizes to keep the page loading fast.  
- You can **further minify** `css/style.css` and `js/main.js` for production if desired.  
- All external links use `target="_blank"` with `rel="noreferrer"` where appropriate.

## License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it for personal or commercial purposes. Attribution is appreciated but not required.

