# OpenDoors (opendoorsri.org)

Plain static copy of the Squarespace site, rebuilt October 2026. No build step: every page is a hand-editable `.html` file.

- `index.html` and one `.html` per page, named after its old Squarespace address, so `/donate` keeps working on GitHub Pages
- `css/site.css`: all styling. `js/site.js`: menus, carousels, headings that fill their box, and forms
- `images/`, `docs/` (PDFs), `video/`, `fonts/`: everything that used to live on Squarespace
- Each block's position is set inline, for example `style="--m:2/2/6/10;--d:1/5/4/10"`: `--m` is the phone grid position and `--d` the desktop one (row start / column start / row end / column end)

**Preview locally:** `python3 -m http.server 8080`, then open http://localhost:8080

## Hosting free on GitHub Pages

1. Create a GitHub repo and push this folder to it.
2. In the repo, go to Settings → Pages, choose "Deploy from a branch", pick `main` and `/ (root)`.

## Connecting opendoorsri.org

1. In Settings → Pages, enter `opendoorsri.org` as the custom domain. GitHub adds a `CNAME` file.
2. At the domain registrar (or in Squarespace Domains, if the domain is registered there), remove the Squarespace DNS records, then add A records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus a CNAME for `www` pointing to `<your-github-username>.github.io`.
3. Once DNS resolves, tick "Enforce HTTPS". Keep any MX records so email keeps working.

## What changed from Squarespace

- **Fonts:** Squarespace's Granville and Brandon Grotesque are licensed for Squarespace only, so the site uses close open-licence matches (Lora and Jost).
- **Email sign-up** still uses the Constant Contact form, which works on any site.
- **Old addresses** such as `/get-involved` and `/home` are small redirect pages.
