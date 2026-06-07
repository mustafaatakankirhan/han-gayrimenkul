export default function Style() {
  return (
    <style>{`

      :root {
        --orange: #ff8a00;
        --dark: #050505;
        --card: rgba(255,255,255,.045);
        --line: rgba(255,255,255,.13);
        --muted: #b7b7b7;
      }

      * { box-sizing: border-box; }
      body { overflow-x: hidden; }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.12), transparent 32%),
          linear-gradient(180deg, #060606, #020202 55%, #050505);
        color: white;
      }

      .hero {
        min-height: 100vh;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid rgba(255,138,0,.28);
      }

      .heroVideo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
      }

      .heroShade {
        position: absolute;
        inset: 0;
        z-index: 1;
        background:
          linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,.88)),
          linear-gradient(to right, rgba(0,0,0,.60), rgba(0,0,0,.25));
      }

      .siteHeader {
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 14px 7%;
        min-height: 86px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        background: rgba(5,5,5,.68);
        border-bottom: 1px solid rgba(255,255,255,.08);
        backdrop-filter: blur(18px);
      }

      .brandBox {
        display: flex;
        align-items: center;
        gap: 14px;
        text-decoration: none;
        color: white;
        min-width: 0;
      }

      .brandLogo {
        width: 62px;
        height: 62px;
        object-fit: contain;
        flex: 0 0 auto;
        filter: drop-shadow(0 14px 30px rgba(0,0,0,.6));
      }

      .brandName {
        margin: 0;
        color: var(--orange);
        font-size: clamp(28px, 3vw, 42px);
        font-weight: 950;
        letter-spacing: -1.4px;
        line-height: .95;
      }

      .brandSlogan {
        margin: 6px 0 0;
        color: rgba(255,255,255,.92);
        font-weight: 700;
        font-size: 15px;
        line-height: 1.15;
      }

      .desktopNav {
        display: flex;
        align-items: center;
        gap: 28px;
      }

      .desktopNav a {
        color: rgba(255,255,255,.82);
        text-decoration: none;
        font-weight: 900;
        transition: .2s ease;
      }

      .desktopNav a:hover { color: var(--orange); }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 0 0 auto;
      }

      .navPill {
        min-height: 48px;
        padding: 0 24px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.55);
        background: rgba(0,0,0,.36);
        color: white;
        font-weight: 950;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .backPill {
        background: rgba(255,138,0,.16);
      }

      .flagBox {
        width: 58px;
        height: 39px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.25);
        box-shadow: 0 18px 38px rgba(0,0,0,.5);
      }

      .flagSvg { display: block; width: 100%; height: 100%; }

      .heroContent {
        position: relative;
        z-index: 3;
        max-width: 1120px;
        margin: 0 auto;
        padding: 140px 7% 80px;
        text-align: center;
      }

      .badge {
        display: inline-flex;
        padding: 12px 26px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.85);
        background: rgba(255,138,0,.10);
        color: var(--orange);
        font-weight: 950;
      }

      .heroTitle {
        max-width: 980px;
        margin: 30px auto 20px;
        font-size: clamp(46px, 7vw, 92px);
        line-height: .98;
        font-weight: 950;
        letter-spacing: -3px;
        text-shadow: 0 22px 60px rgba(0,0,0,.9);
      }

      .heroText {
        max-width: 780px;
        margin: 0 auto;
        color: rgba(255,255,255,.88);
        font-size: 21px;
        line-height: 1.65;
        font-weight: 650;
      }

      .heroActions {
        margin-top: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
      }

      .heroBtn, .ghostBtn {
        min-height: 56px;
        padding: 0 30px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 950;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border: none;
        cursor: pointer;
      }

      .heroBtn {
        background: var(--orange);
        color: #050505;
        box-shadow: 0 20px 55px rgba(255,138,0,.22);
        border: 1px solid rgba(255,255,255,.75);
      }

      .ghostBtn {
        color: white;
        border: 1px solid rgba(255,255,255,.22);
        background: rgba(0,0,0,.25);
        backdrop-filter: blur(12px);
      }

      .statsGrid {
        margin: 48px auto 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
      }

      .statBox {
        padding: 22px 14px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        border-radius: 22px;
        backdrop-filter: blur(18px);
        text-align: center;
        transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
      }

      .statBox:hover {
        transform: translateY(-5px);
        border-color: rgba(255,138,0,.5);
        box-shadow: 0 16px 40px rgba(255,138,0,.12);
      }

      .statBox strong {
        display: block;
        color: var(--orange);
        font-size: 32px;
        font-weight: 950;
        letter-spacing: -1px;
      }

      .statBox span {
        display: block;
        margin-top: 6px;
        color: rgba(255,255,255,.82);
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .logoIcon { width: 22px; height: 22px; object-fit: contain; }

      .adminLogin {
        position: fixed;
        right: 22px;
        top: 100px;
        z-index: 1000;
        width: min(340px, calc(100vw - 44px));
        padding: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,138,0,.42);
        background: rgba(8,8,8,.94);
        backdrop-filter: blur(18px);
      }

      .adminLoginTitle { color: var(--orange); margin: 0 0 12px; font-weight: 950; }
      .adminLoginRow { display: flex; gap: 8px; }
      .passwordInput, .input, .textarea {
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: white;
        border-radius: 14px;
        padding: 14px;
        outline: none;
        width: 100%;
      }

      .passwordInput { border-radius: 999px; }
      .adminBtn, .addBtn, .cancelBtn {
        border-radius: 999px;
        border: 1px solid var(--orange);
        background: rgba(255,138,0,.16);
        color: white;
        padding: 12px 18px;
        font-weight: 950;
        cursor: pointer;
      }

      .adminPanel {
        max-width: 1180px;
        margin: 34px auto 0;
        padding: 28px;
        border-radius: 28px;
        border: 1px solid rgba(255,138,0,.34);
        background: linear-gradient(135deg, rgba(255,138,0,.10), rgba(255,255,255,.045));
      }

      .adminTitle { margin: 0 0 18px; color: var(--orange); }
      .formGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }

      .uploadBox {
        grid-column: 1 / -1;
        border: 1px dashed rgba(255,138,0,.48);
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.14), transparent 42%),
          rgba(255,255,255,.045);
        border-radius: 24px;
        padding: 26px 18px;
        text-align: center;
        transition: .25s ease;
      }

      .uploadBox.dragActive {
        border-color: var(--orange);
        background: rgba(255,138,0,.12);
        transform: translateY(-2px);
      }

      .uploadIcon {
        font-size: 38px;
        margin-bottom: 6px;
      }

      .uploadBox h3 {
        margin: 0 0 8px;
        color: #fff;
        font-size: 22px;
      }

      .uploadBox p {
        margin: 0 auto 16px;
        max-width: 620px;
        color: #bdbdbd;
        line-height: 1.5;
      }

      .uploadBtn {
        min-height: 50px;
        padding: 0 24px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.75);
        background: var(--orange);
        color: #050505;
        font-weight: 950;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 18px 45px rgba(255,138,0,.16);
      }

      .uploadBtn input {
        display: none;
      }

      .uploadProgress {
        display: block;
        margin-top: 12px;
        color: var(--orange);
        font-weight: 900;
      }

      .imageTextarea {
        min-height: 86px;
        font-size: 13px;
      }

      .input.full, .textarea, .hint { grid-column: 1 / -1; }
      .textarea { min-height: 110px; resize: vertical; }
      .hint { color: #aaa; margin: 0; font-size: 13px; }
      .addBtn { margin-top: 18px; background: var(--orange); color: #050505; }
      .cancelBtn { margin-top: 18px; margin-left: 10px; background: transparent; }

      .listings {
        max-width: 1260px;
        margin: 0 auto;
        padding: 78px 7% 48px;
      }

      .sectionLabel {
        text-align: center;
        margin: 0;
        color: var(--orange);
        letter-spacing: 2px;
        font-weight: 950;
      }

      .sectionTitle {
        text-align: center;
        font-size: clamp(34px, 5vw, 50px);
        margin: 10px 0 26px;
        letter-spacing: -1px;
      }

      .filters {
        display: flex;
        justify-content: center;
        gap: 14px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .filterBtn {
        min-width: 130px;
        padding: 15px 26px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.20);
        background: rgba(0,0,0,.18);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .filterBtn.active {
        background: var(--orange);
        border-color: var(--orange);
        color: #050505;
      }

      .typeFilters {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin: 0 auto 22px;
        max-width: 980px;
      }

      .typeFilter {
        padding: 10px 15px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.045);
        color: rgba(255,255,255,.82);
        font-weight: 850;
        cursor: pointer;
      }

      .typeFilter.active {
        border-color: rgba(255,138,0,.8);
        color: var(--orange);
        background: rgba(255,138,0,.10);
        box-shadow: 0 0 28px rgba(255,138,0,.10);
      }

      .priceRangeRow {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 0 auto 24px;
        max-width: 980px;
      }
      .priceRangeLabel {
        font-size: 14px;
        font-weight: 700;
        color: rgba(255,255,255,.7);
        white-space: nowrap;
      }
      .priceInput {
        width: 160px;
        padding: 10px 14px !important;
        border-radius: 999px !important;
        border: 1px solid rgba(255,255,255,.16) !important;
        background: rgba(255,255,255,.045) !important;
        color: white !important;
        font-size: 14px !important;
        text-align: center;
      }
      .priceRangeDash { color: rgba(255,255,255,.4); font-weight: 700; }
      .clearPriceBtn {
        background: rgba(255,100,100,.15);
        border: 1px solid rgba(255,100,100,.3);
        color: #ff6b6b;
        border-radius: 999px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background .2s;
      }
      .clearPriceBtn:hover { background: rgba(255,100,100,.25); }

      .benzerSection {
        padding: 60px 20px;
        text-align: center;
        border-top: 1px solid rgba(255,255,255,.08);
      }

      .typeFilter {
        position: relative;
        overflow: hidden;
      }

      .typeFilter:hover {
        border-color: rgba(255,138,0,.55);
        transform: translateY(-1px);
      }

      .featuredBadge {
        position: absolute;
        left: 16px;
        top: 64px;
        z-index: 3;
        padding: 8px 13px;
        border-radius: 999px;
        background: rgba(255,138,0,.16);
        border: 1px solid rgba(255,138,0,.55);
        color: #fff;
        font-weight: 950;
        backdrop-filter: blur(12px);
      }

      .proAdminPanel {
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.16), transparent 36%),
          linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.026));
      }

      .adminHead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 22px;
      }

      .adminEyebrow {
        margin: 0 0 6px;
        color: var(--orange);
        letter-spacing: 2px;
        font-size: 12px;
        font-weight: 950;
      }

      .featuredToggle {
        min-height: 52px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.42);
        background: rgba(255,138,0,.08);
        color: white;
        font-weight: 950;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        white-space: nowrap;
      }

      .featuredToggle input {
        width: 18px;
        height: 18px;
        accent-color: var(--orange);
      }

      .adminSection {
        margin-top: 18px;
        padding: 20px;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(0,0,0,.18);
      }

      .adminSection h3 {
        margin: 0 0 14px;
        color: #fff;
        font-size: 20px;
      }

      .photoManager {
        margin-top: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.035);
        padding: 16px;
      }

      .photoManagerHead {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      .photoManagerHead strong {
        color: var(--orange);
        font-size: 18px;
      }

      .photoManagerHead span {
        color: #bdbdbd;
        font-size: 13px;
      }

      .photoManageGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
      }

      .photoManageItem {
        position: relative;
        height: 120px;
        border-radius: 18px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,.10);
        background: #000;
      }

      .sortablePhoto {
        cursor: grab;
        touch-action: none;
        user-select: none;
      }

      .sortablePhoto:active {
        cursor: grabbing;
      }

      .dragHint {
        position: absolute;
        left: 8px;
        bottom: 8px;
        z-index: 4;
        padding: 6px 9px;
        border-radius: 999px;
        background: rgba(0,0,0,.58);
        color: rgba(255,255,255,.86);
        font-size: 11px;
        font-weight: 900;
        border: 1px solid rgba(255,255,255,.16);
        backdrop-filter: blur(8px);
        pointer-events: none;
      }

      .photoManageItem.cover {
        border-color: var(--orange);
        box-shadow: 0 0 25px rgba(255,138,0,.16);
      }

      .photoManageItem img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .photoManageOverlay {
        position: absolute;
        inset: 0;
        padding: 8px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        background: linear-gradient(to bottom, rgba(0,0,0,.28), rgba(0,0,0,.78));
        opacity: 0;
        transition: .2s ease;
        pointer-events: none;
      }

      .photoManageItem:hover .photoManageOverlay,
      .photoManageItem.cover .photoManageOverlay {
        opacity: 1;
      }

      .photoManageOverlay button {
        border: 1px solid rgba(255,255,255,.20);
        background: rgba(0,0,0,.56);
        color: white;
        border-radius: 999px;
        padding: 7px 9px;
        font-weight: 900;
        cursor: pointer;
        backdrop-filter: blur(10px);
        pointer-events: auto;
      }

      .photoMoveBtns {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .photoMoveBtns button {
        flex: 1;
        min-width: 34px;
      }

      .photoMoveBtns .removePhoto {
        background: rgba(176,0,32,.82);
      }

      .photoMoveBtns button:disabled {
        opacity: .35;
        cursor: not-allowed;
      }

      .adminActions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .favoriteFilterRow {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;
        margin: 0 0 36px;
      }

      .favoriteFilter, .clearFavFilter {
        border-radius: 999px;
        padding: 12px 18px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.045);
        color: white;
        font-weight: 900;
        cursor: pointer;
      }

      .favoriteFilter.active {
        border-color: rgba(255,138,0,.8);
        color: #050505;
        background: var(--orange);
      }

      .clearFavFilter {
        color: var(--orange);
        border-color: rgba(255,138,0,.42);
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
        gap: 32px;
        align-items: stretch;
      }

      .card {
        border-radius: 26px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.13);
        background: linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.025));
        box-shadow: 0 26px 75px rgba(0,0,0,.42);
        transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
      }

      .card:hover {
        transform: translateY(-6px);
        border-color: rgba(255,138,0,.65);
        box-shadow: 0 34px 90px rgba(255,138,0,.10);
      }

      .cardMainLink { text-decoration: none; color: inherit; display: block; }

      .imageWrap {
        position: relative;
        height: 300px;
        overflow: hidden;
        background: #000;
      }

      .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .5s ease;
      }

      .card:hover .image { transform: scale(1.06); }

      .status, .photoCount, .typeBadge {
        position: absolute;
        border-radius: 999px;
        font-weight: 950;
        z-index: 2;
      }

      .status {
        left: 16px;
        top: 16px;
        padding: 10px 16px;
        background: var(--orange);
        color: #050505;
      }

      .typeBadge {
        left: 16px;
        bottom: 16px;
        padding: 8px 14px;
        background: rgba(0,0,0,.56);
        color: white;
        border: 1px solid rgba(255,255,255,.18);
        backdrop-filter: blur(12px);
      }

      .photoCount {
        right: 16px;
        top: 16px;
        padding: 9px 14px;
        background: rgba(0,0,0,.58);
        color: white;
        border: 1px solid rgba(255,255,255,.20);
        backdrop-filter: blur(12px);
      }

      .favoriteBtn {
        min-height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(0,0,0,.44);
        color: white;
        font-weight: 950;
        cursor: pointer;
        backdrop-filter: blur(12px);
      }

      .favoriteBtn.active {
        background: rgba(255,138,0,.92);
        color: #050505;
        border-color: var(--orange);
      }

      .favoriteBtn.compact {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 5;
        width: 48px;
        height: 48px;
        padding: 0;
        font-size: 25px;
      }

      .cardBody { padding: 24px 24px 12px; text-align: center; }
      .location { margin: 0; color: var(--muted); font-size: 14px; }
      .cardTitle { min-height: 62px; margin: 12px 0; font-size: 22px; line-height: 1.25; }
      .price, .detailPrice { color: var(--orange); font-size: 31px; font-weight: 950; margin: 12px 0; letter-spacing: -1px; }
      .details, .detailSpecs {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 14px 0;
      }

      .details span, .detailSpecs span {
        padding: 9px 12px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,.16);
        color: #eee;
        font-size: 13px;
        font-weight: 800;
      }

      .buttonRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        padding: 18px 24px 24px;
      }

      .whatsapp, .instagram, .mapsBtn, .editBtn, .deleteBtn {
        min-height: 48px;
        padding: 11px 14px;
        border-radius: 15px;
        text-decoration: none;
        color: white;
        font-weight: 950;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .whatsapp { background: rgba(37,211,102,.18); border: 1px solid rgba(37,211,102,.46); }
      .instagram { background: rgba(225,48,108,.18); border: 1px solid rgba(225,48,108,.46); }
      .mapsBtn { background: rgba(255,138,0,.14); border: 1px solid rgba(255,138,0,.45); }
      .editBtn { background: #1f6feb; }
      .deleteBtn { background: #b00020; }

      .emptyState {
        padding: 34px;
        border-radius: 24px;
        text-align: center;
        border: 1px solid rgba(255,255,255,.12);
        color: #bbb;
      }

      .smartSearchBox {
        max-width: 760px;
        margin: 0 auto 18px;
        min-height: 62px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.32);
        background: rgba(255,255,255,.055);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 18px;
        box-shadow: 0 22px 70px rgba(0,0,0,.28);
        backdrop-filter: blur(16px);
      }

      .smartSearchBox span {
        font-size: 22px;
      }

      .smartSearchBox input {
        flex: 1;
        border: 0;
        outline: 0;
        background: transparent;
        color: white;
        font-size: 17px;
        font-weight: 750;
      }

      .smartSearchBox input::placeholder {
        color: rgba(255,255,255,.48);
      }

      .smartSearchBox button {
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.34);
        color: var(--orange);
        border-radius: 999px;
        padding: 10px 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .blogSection {
        max-width: 1180px;
        margin: 0 auto;
        padding: 42px 7% 74px;
      }

      .blogGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .blogCard {
        min-height: 260px;
        padding: 26px;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.12), transparent 42%),
          rgba(255,255,255,.045);
        text-decoration: none;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: .25s ease;
      }

      .blogCard:hover {
        transform: translateY(-6px);
        border-color: rgba(255,138,0,.5);
        box-shadow: 0 28px 75px rgba(255,138,0,.09);
      }

      .blogCard span {
        width: fit-content;
        padding: 8px 12px;
        border-radius: 999px;
        color: var(--orange);
        background: rgba(255,138,0,.10);
        border: 1px solid rgba(255,138,0,.32);
        font-weight: 950;
      }

      .blogCard h3 {
        margin: 18px 0 10px;
        font-size: 24px;
        line-height: 1.15;
      }

      .blogCard p {
        margin: 0;
        color: #cfcfcf;
        line-height: 1.55;
      }

      .blogCard strong {
        color: var(--orange);
        margin-top: 18px;
      }

      .blogDetail {
        width: min(900px, calc(100% - 36px));
        margin: 36px auto 70px;
        padding: 34px;
        border-radius: 30px;
        border: 1px solid rgba(255,255,255,.12);
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025));
      }

      .blogDetailCategory {
        display: inline-flex;
        margin-top: 24px;
        color: var(--orange);
        font-weight: 950;
      }

      .blogDetail h1 {
        font-size: clamp(38px, 6vw, 62px);
        line-height: 1;
        letter-spacing: -2px;
        margin: 18px 0;
      }

      .blogLead {
        color: #d4d4d4;
        font-size: 21px;
        line-height: 1.6;
      }

      .blogDetail article {
        margin-top: 28px;
        color: #d0d0d0;
        font-size: 18px;
        line-height: 1.8;
      }

      .blogDetail article h2 {
        color: white;
        margin-top: 32px;
      }

      .blogCta {
        margin-top: 34px;
        padding: 26px;
        border-radius: 24px;
        background: rgba(255,138,0,.10);
        border: 1px solid rgba(255,138,0,.34);
      }

      .fullscreenBtn {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 12;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(0,0,0,.56);
        color: white;
        font-weight: 950;
        cursor: pointer;
        backdrop-filter: blur(12px);
      }

      .fullGalleryOverlay {
        position: fixed;
        inset: 0;
        z-index: 5000;
        background: rgba(0,0,0,.96);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .fullGalleryTop {
        position: absolute;
        top: 18px;
        left: 18px;
        right: 18px;
        z-index: 5010;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .fullGalleryTop button,
      .fullGalleryTop span {
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(15,15,15,.62);
        color: white;
        font-weight: 950;
        backdrop-filter: blur(12px);
      }

      .fullGalleryTop button {
        cursor: pointer;
      }

      .fullGalleryImage {
        max-width: 96vw;
        max-height: 82vh;
        object-fit: contain;
        transition: transform .25s ease;
        cursor: zoom-in;
      }

      .fullGalleryImage.zoomed {
        transform: scale(1.7);
        cursor: zoom-out;
      }

      .fullArrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 5010;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(15,15,15,.62);
        color: white;
        font-size: 42px;
        cursor: pointer;
        backdrop-filter: blur(12px);
      }

      .fullArrow.left { left: 24px; }
      .fullArrow.right { right: 24px; }

      .fullGalleryThumbs {
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 18px;
        z-index: 5010;
        display: flex;
        justify-content: center;
        gap: 8px;
        overflow-x: auto;
        padding: 8px;
      }

      .fullGalleryThumbs button {
        flex: 0 0 74px;
        width: 74px;
        height: 54px;
        border-radius: 12px;
        overflow: hidden;
        padding: 0;
        border: 2px solid transparent;
        opacity: .7;
        background: transparent;
        cursor: pointer;
      }

      .fullGalleryThumbs button.active {
        opacity: 1;
        border-color: var(--orange);
      }

      .fullGalleryThumbs img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .guide {
        max-width: 1120px;
        margin: 0 auto;
        padding: 30px 7% 70px;
      }

      .guideGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .guideGrid > div {
        padding: 24px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
      }

      .guideGrid h3 { color: var(--orange); margin: 0 0 10px; }
      .guideGrid p { color: #cfcfcf; margin: 0; line-height: 1.6; }

      .detailPage { overflow-x: hidden; }
      .mobileDetailBack { display: none; }

      .detailWrap {
        width: min(1280px, calc(100% - 42px));
        margin: 28px auto;
        display: grid;
        grid-template-columns: 1.18fr .82fr;
        gap: 28px;
        align-items: start;
      }

      .detailGallery, .detailInfo {
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 30px;
        background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.025));
        box-shadow: 0 30px 80px rgba(0,0,0,.42);
      }

      .detailGallery { padding: 18px; overflow: hidden; }

      .detailImageFrame {
        position: relative;
        width: 100%;
        height: 650px;
        border-radius: 24px;
        overflow: hidden;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .detailMainImage {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        background: #000;
        display: block;
      }

      .galleryArrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 54px;
        height: 54px;
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(10,10,10,.55);
        color: #fff;
        font-size: 34px;
        cursor: pointer;
        z-index: 20;
        backdrop-filter: blur(10px);
        transition: all .25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .galleryArrow:hover {
        background: var(--orange);
        color: #050505;
        transform: translateY(-50%) scale(1.08);
      }

      .arrowLeft { left: 18px; }
      .arrowRight { right: 18px; }

      .detailThumbs {
        margin-top: 14px;
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 8px;
      }

      .detailThumb {
        flex: 0 0 86px;
        width: 86px;
        height: 66px;
        border-radius: 14px;
        overflow: hidden;
        border: 2px solid transparent;
        background: transparent;
        padding: 0;
        cursor: pointer;
        opacity: .72;
      }

      .detailThumb.active {
        border-color: var(--orange);
        opacity: 1;
      }

      .detailThumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .detailInfo { padding: 30px; }
      .detailTopActions {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
      }

      .backToListingsBtn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 50px;
        padding: 0 22px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.12);
        background: linear-gradient(135deg, #ff8c00, #ff6a00);
        color: white !important;
        font-weight: 950;
        text-decoration: none;
        cursor: pointer;
        box-shadow: 0 12px 30px rgba(255,138,0,.32), 0 0 20px rgba(255,138,0,.12);
        transition: transform .22s ease, box-shadow .22s ease;
      }

      .backToListingsBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 42px rgba(255,138,0,.45), 0 0 28px rgba(255,138,0,.18);
      }

      .detailBadges { display: flex; gap: 10px; flex-wrap: wrap; }
      .detailBadges span {
        padding: 11px 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.55);
        background: rgba(255,138,0,.10);
        color: var(--orange);
        font-weight: 950;
      }

      .detailInfo h2 {
        margin: 24px 0 12px;
        font-size: clamp(32px, 4vw, 48px);
        line-height: 1.05;
      }

      .detailLocation { color: var(--muted); font-weight: 750; }
      .detailPrice { font-size: 44px; }
      .detailSpecs { justify-content: flex-start; }

      .detailTopRight {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .shareBtn {
        min-height: 48px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.055);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .waShareBtn {
        background: #25D366 !important;
        border-color: #25D366 !important;
        color: white !important;
        display: flex;
        align-items: center;
        transition: transform .2s, box-shadow .2s;
      }

      .waShareBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(37,211,102,.4);
      }

      .saveWaBtn {
        background: rgba(37,211,102,.15);
        border: 1px solid rgba(37,211,102,.3);
        color: #25D366;
        border-radius: 999px;
        padding: 0 14px;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        min-height: 36px;
        transition: background .2s, transform .2s;
        white-space: nowrap;
      }

      .saveWaBtn:hover {
        background: rgba(37,211,102,.28);
        transform: translateY(-1px);
      }

      .detailFeatureGrid {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .detailFeature {
        padding: 16px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 3px 10px;
        align-items: center;
      }

      .detailFeature b {
        grid-row: span 2;
        font-size: 25px;
      }

      .detailFeature span {
        color: #a9a9a9;
        font-size: 12px;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: .7px;
      }

      .detailFeature strong {
        font-size: 16px;
        color: #fff;
      }

      .proBox {
        position: relative;
        overflow: hidden;
      }

      .proBox::before {
        content: "";
        position: absolute;
        inset: 0 auto 0 0;
        width: 3px;
        background: linear-gradient(to bottom, transparent, var(--orange), transparent);
        opacity: .8;
      }

      .boxHeader {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }

      .boxHeader span {
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255,138,0,.14);
        color: var(--orange);
        border: 1px solid rgba(255,138,0,.35);
        font-size: 13px;
        font-weight: 950;
      }

      .boxHeader h3 {
        margin: 0;
      }

      .investmentHighlight {
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.16), transparent 40%),
          rgba(255,255,255,.035);
      }

      .detailTwoCol {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .miniMapBtn {
        display: inline-flex;
        margin-top: 14px;
        padding: 10px 15px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.45);
        color: var(--orange);
        text-decoration: none;
        font-weight: 950;
      }

      .locationBox small {
        display: block;
        color: #aaa;
        line-height: 1.5;
      }

      .trustStrip {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .trustStrip div {
        padding: 14px 10px;
        border-radius: 18px;
        text-align: center;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.24);
      }

      .trustStrip strong {
        display: block;
        color: var(--orange);
        font-weight: 950;
      }

      .trustStrip span {
        display: block;
        margin-top: 3px;
        color: #bdbdbd;
        font-size: 12px;
        font-weight: 800;
      }

      .detailText, .investmentBox, .consultantBox {
        margin-top: 22px;
        padding: 22px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.035);
      }

      .detailText h3, .investmentBox h3, .consultantBox h3 {
        margin: 0 0 10px;
        color: var(--orange);
      }

      .detailText p, .investmentBox p, .consultantBox p {
        margin: 0;
        color: #d0d0d0;
        line-height: 1.7;
      }

      .detailActions {
        margin-top: 24px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .big { min-height: 56px; }

      .notFound {
        min-height: 55vh;
        display: grid;
        place-items: center;
        text-align: center;
      }

      .contact {
        max-width: 1120px;
        margin: 20px auto 0;
        padding: 58px 7% 32px;
        border-top: 1px solid rgba(255,255,255,.12);
        text-align: center;
      }

      .contactTitle { font-size: clamp(34px, 5vw, 44px); margin: 0 0 32px; }
      .contactGrid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
      }

      .contactItem {
        padding: 26px 18px;
        border: 1px solid rgba(255,255,255,.13);
        border-radius: 22px;
        background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.026));
      }

      .contactIcon { color: var(--orange); font-size: 28px; margin-bottom: 10px; }
      .contactName { margin: 0 0 8px; font-weight: 900; font-size: 18px; }
      .contactPhone { color: var(--orange); margin: 5px 0; font-weight: 950; font-size: 19px; }
      .emailText { color: white; word-break: break-word; line-height: 1.45; }
      .contactLocation { margin-top: 30px; font-size: 20px; }

      .follow {
        margin-top: 34px;
        padding-top: 28px;
        border-top: 1px solid rgba(255,255,255,.12);
      }

      .followTitle { display: inline-block; margin-bottom: 18px; font-weight: 950; color: #ddd; }
      .socials { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
      .socialBtn {
        min-width: 158px;
        padding: 13px 22px;
        border-radius: 999px;
        border: 1px solid var(--orange);
        color: white;
        text-decoration: none;
        font-weight: 950;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        background: rgba(255,138,0,.05);
      }

      .footer { padding: 30px; text-align: center; color: #aaa; }
      .footer strong { color: var(--orange); }

      
      .aiTools {
        grid-column: 1 / -1;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        padding: 14px;
        border-radius: 18px;
        border: 1px solid rgba(255,138,0,.22);
        background: rgba(255,138,0,.07);
      }

      .aiTools button {
        min-height: 46px;
        padding: 0 18px;
        border-radius: 999px;
        border: 1px solid rgba(255,138,0,.45);
        background: rgba(0,0,0,.28);
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .aiTools button:hover {
        background: var(--orange);
        color: #050505;
      }

      .adminRouteWrap {
        width: min(1180px, calc(100% - 28px));
        margin: 30px auto 70px;
      }

      .adminRouteTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 22px;
        padding: 24px;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.045);
      }

      .adminRouteTop h1 {
        margin: 0;
        font-size: clamp(34px, 5vw, 52px);
        letter-spacing: -1.5px;
      }

      .adminGate {
        min-height: 70vh;
        display: grid;
        place-items: center;
      }

      .adminGateCard {
        width: min(480px, 100%);
        padding: 34px;
        border-radius: 32px;
        border: 1px solid rgba(255,138,0,.32);
        background:
          radial-gradient(circle at top left, rgba(255,138,0,.16), transparent 42%),
          linear-gradient(180deg, rgba(255,255,255,.065), rgba(255,255,255,.028));
        text-align: center;
        box-shadow: 0 34px 90px rgba(0,0,0,.45);
      }

      .adminGateCard img {
        width: 86px;
        height: 86px;
        object-fit: contain;
        margin-bottom: 16px;
      }

      .adminGateCard p {
        margin: 0;
        color: var(--orange);
        font-weight: 950;
        letter-spacing: 1.5px;
      }

      .adminGateCard h2 {
        margin: 10px 0;
        font-size: 34px;
      }

      .adminGateCard span {
        color: #bcbcbc;
        display: block;
        margin-bottom: 24px;
      }

      .adminGateLogin {
        display: flex;
        gap: 10px;
      }

      .adminGateLogin input {
        flex: 1;
        min-width: 0;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: white;
        border-radius: 999px;
        padding: 14px 16px;
        outline: none;
      }

      .adminGateLogin button {
        border-radius: 999px;
        border: 1px solid var(--orange);
        background: var(--orange);
        color: #050505;
        padding: 0 18px;
        font-weight: 950;
        cursor: pointer;
      }

      
      .adminListPanel {
        margin-top: 28px;
        padding: 24px;
        border-radius: 28px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.10), transparent 36%),
          rgba(255,255,255,.035);
      }

      .adminListHead {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 20px;
      }

      .adminListHead h2 {
        margin: 0;
        font-size: clamp(28px, 4vw, 42px);
        letter-spacing: -1px;
      }

      .adminSearchBox {
        min-width: min(360px, 100%);
        min-height: 50px;
        padding: 0 14px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(0,0,0,.22);
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .adminSearchBox input {
        flex: 1;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: white;
        font-weight: 800;
      }

      .adminListingGrid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 16px;
      }

      .adminListingCard {
        overflow: hidden;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.22);
        display: grid;
        grid-template-rows: 180px 1fr auto;
      }

      .adminListingImage {
        position: relative;
        background: #000;
        overflow: hidden;
      }

      .adminListingImage img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .adminListingImage span {
        position: absolute;
        left: 12px;
        top: 12px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(255,138,0,.18);
        border: 1px solid rgba(255,138,0,.52);
        color: white;
        font-weight: 950;
        backdrop-filter: blur(10px);
      }

      .adminListingInfo {
        padding: 16px;
      }

      .adminListingBadges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .adminListingBadges b {
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(255,138,0,.10);
        border: 1px solid rgba(255,138,0,.28);
        color: var(--orange);
        font-size: 12px;
      }

      .adminListingInfo h3 {
        margin: 12px 0 6px;
        font-size: 20px;
        line-height: 1.2;
      }

      .adminListingInfo p {
        margin: 0 0 8px;
        color: #aaa;
      }

      .adminListingInfo strong {
        display: block;
        color: var(--orange);
        font-size: 22px;
        margin-bottom: 10px;
      }

      .adminListingMeta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .adminListingMeta span {
        padding: 7px 10px;
        border-radius: 10px;
        background: rgba(255,255,255,.06);
        color: #ddd;
        font-size: 12px;
        font-weight: 850;
      }

      .adminListingActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 0 16px 16px;
      }

      .adminEditBtn,
      .adminDeleteBtn {
        min-height: 46px;
        border-radius: 14px;
        border: 0;
        color: white;
        font-weight: 950;
        cursor: pointer;
      }

      .adminEditBtn {
        background: rgba(255,138,0,.88);
        color: #050505;
      }

      .adminDeleteBtn {
        background: rgba(176,0,32,.82);
      }

      
      .videoBadge {
        position: absolute;
        right: 16px;
        bottom: 16px;
        z-index: 4;
        padding: 8px 13px;
        border-radius: 999px;
        background: rgba(255,255,255,.12);
        border: 1px solid rgba(255,255,255,.28);
        color: white;
        font-weight: 950;
        backdrop-filter: blur(12px);
      }

      .videoUploadBox {
        grid-column: 1 / -1;
        padding: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
      }

      .videoUploadBox strong {
        color: var(--orange);
        font-size: 20px;
      }

      .videoUploadBox p {
        margin: 6px 0 0;
        color: #bbb;
      }

      .adminVideoPreview {
        grid-column: 1 / -1;
        border-radius: 22px;
        overflow: hidden;
        background: #000;
        border: 1px solid rgba(255,255,255,.12);
      }

      .adminVideoPreview video {
        width: 100%;
        max-height: 420px;
        display: block;
      }

      .detailVideoBox {
        margin-top: 18px;
        padding: 18px;
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.04);
      }

      .detailVideoBox video {
        width: 100%;
        border-radius: 18px;
        background: #000;
        display: block;
      }

      .whyUsSection,
      .testimonialsSection {
        max-width: 1180px;
        margin: 0 auto;
        padding: 42px 7% 54px;
      }

      .whyUsGrid,
      .testimonialGrid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 18px;
      }

      .testimonialGrid {
        grid-template-columns: repeat(3, 1fr);
      }

      .whyUsGrid > div,
      .testimonialGrid > div {
        padding: 24px;
        border-radius: 26px;
        border: 1px solid rgba(255,255,255,.12);
        background:
          radial-gradient(circle at top right, rgba(255,138,0,.10), transparent 45%),
          rgba(255,255,255,.04);
      }

      .whyUsGrid span {
        display: inline-flex;
        font-size: 32px;
        margin-bottom: 12px;
      }

      .whyUsGrid h3,
      .testimonialGrid strong {
        color: white;
        font-size: 20px;
        line-height: 1.25;
      }

      .whyUsGrid p,
      .testimonialGrid p {
        color: #c9c9c9;
        line-height: 1.6;
      }

      .testimonialGrid span {
        color: var(--orange);
        font-weight: 950;
        font-size: 13px;
      }

      @media (max-width: 980px) {
        .desktopNav { display: none; }
        .hamburger { display: flex; }
        .statsGrid { grid-template-columns: repeat(2, 1fr); }
        .detailWrap { grid-template-columns: 1fr; }
        .contactGrid { grid-template-columns: repeat(2, 1fr); }
        .guideGrid { grid-template-columns: 1fr; }
      }

      @media (max-width: 768px) {

        .aiTools {
          flex-direction: column;
        }

        .aiTools button {
          width: 100%;
        }

        .adminRouteTop {
          align-items: stretch;
          flex-direction: column;
          padding: 20px;
        }

        .adminGateCard {
          padding: 26px 18px;
        }

        .adminGateLogin {
          flex-direction: column;
        }

        .adminGateLogin button {
          min-height: 48px;
        }


        .adminListPanel {
          padding: 16px;
        }

        .adminListHead {
          align-items: stretch;
          flex-direction: column;
        }

        .adminSearchBox {
          width: 100%;
        }

        .adminListingGrid {
          grid-template-columns: 1fr;
        }

        .adminListingCard {
          grid-template-rows: 210px 1fr auto;
        }


        .videoUploadBox {
          align-items: stretch;
          flex-direction: column;
        }

        .whyUsSection,
        .testimonialsSection {
          padding: 34px 14px 44px;
        }

        .whyUsGrid,
        .testimonialGrid {
          grid-template-columns: 1fr;
        }

        .detailVideoBox {
          margin: 14px 0 0;
          border-radius: 18px;
          padding: 12px;
        }

        .siteHeader {
          min-height: 74px;
          padding: 12px 14px;
          gap: 8px;
        }

        .brandLogo { width: 48px; height: 48px; }
        .brandBox { gap: 9px; }
        .brandName { font-size: 25px; letter-spacing: -1px; }
        .brandSlogan { font-size: 12px; max-width: 180px; }
        .navPill {
          min-height: 42px;
          padding: 0 14px;
          font-size: 13px;
        }
        .flagBox { width: 48px; height: 34px; }

        .hero { min-height: auto; }
        .heroContent { padding: 70px 18px 58px; }
        .heroTitle {
          font-size: clamp(40px, 11vw, 58px);
          letter-spacing: -2px;
          line-height: 1;
        }
        .heroText { font-size: 18px; line-height: 1.55; }
        .heroBtn, .ghostBtn { width: 100%; max-width: 420px; }

        .statsGrid {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 34px;
        }

        .statBox { padding: 14px 10px; border-radius: 18px; }
        .statBox strong { font-size: 18px; }
        .statBox span { font-size: 12px; }

        .adminPanel {
          margin: 22px 14px 0;
          padding: 20px;
        }

        .listings {
          padding: 54px 14px 34px;
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .filterBtn {
          min-width: 0;
          padding: 13px 6px;
        }

        .typeFilters {
          justify-content: flex-start;
          overflow-x: auto;
          flex-wrap: nowrap;
          padding: 0 2px 8px;
        }

        .typeFilter {
          flex: 0 0 auto;
          white-space: nowrap;
        }

        .adminHead {
          align-items: stretch;
          flex-direction: column;
        }

        .featuredToggle {
          width: 100%;
          justify-content: center;
        }

        .adminSection {
          padding: 16px;
        }

        .photoManagerHead {
          align-items: flex-start;
          flex-direction: column;
        }

        .photoManageGrid {
          grid-template-columns: repeat(2, 1fr);
        }

        .photoManageItem {
          height: 118px;
        }

        .photoManageOverlay {
          opacity: 1;
        }

        .featuredBadge {
          top: 62px;
          left: 14px;
          font-size: 12px;
        }

        .cards {
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .imageWrap {
          height: 250px;
        }

        .cardBody { padding: 22px 18px 10px; }
        .cardTitle { min-height: 0; font-size: 23px; }
        .price { font-size: 30px; }
        .buttonRow {
          grid-template-columns: 1fr 1fr;
          padding: 16px 18px 20px;
        }

        .detailWrap {
          width: 100%;
          margin: 0;
          gap: 0;
        }

        .mobileDetailBack {
          display: block;
          padding: 12px 12px 0;
        }

        .mobileDetailBack button {
          width: 100%;
          min-height: 48px;
          border-radius: 999px;
          border: 1px solid rgba(255,138,0,.45);
          background: rgba(255,138,0,.12);
          color: white;
          font-weight: 950;
        }

        .detailGallery {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
          padding: 10px;
        }

        .detailImageFrame {
          width: 100%;
          height: 56vh;
          min-height: 330px;
          max-height: 520px;
          border-radius: 18px;
          background: #000;
        }

        .detailMainImage {
          width: 100%;
          height: 100%;
          object-fit: contain !important;
          object-position: center !important;
          background: #000;
          transform: none !important;
        }

        .galleryArrow {
          width: 44px;
          height: 44px;
          font-size: 28px;
        }

        .arrowLeft { left: 12px; }
        .arrowRight { right: 12px; }

        .detailThumbs {
          gap: 8px;
          padding-bottom: 4px;
        }

        .detailThumb {
          flex-basis: 72px;
          width: 72px;
          height: 56px;
          border-radius: 12px;
        }

        .detailInfo {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
          padding: 24px 18px;
        }

        .detailTopActions {
          display: none;
        }

        .detailFeatureGrid {
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .detailFeature {
          padding: 14px 12px;
          border-radius: 16px;
        }

        .detailFeature b {
          font-size: 21px;
        }

        .detailFeature strong {
          font-size: 14px;
        }

        .detailTwoCol {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .trustStrip {
          grid-template-columns: 1fr;
        }

        .stickyContactActions {
          position: sticky;
          bottom: 10px;
          z-index: 20;
          padding: 10px;
          margin-left: -10px;
          margin-right: -10px;
          border-radius: 22px;
          background: rgba(5,5,5,.72);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
        }

        .shareBtn {
          min-height: 44px;
        }

        .detailInfo h2 {
          font-size: 32px;
        }

        .detailPrice {
          font-size: 38px;
        }

        .detailSpecs {
          justify-content: flex-start;
        }

        .smartSearchBox {
          min-height: 56px;
          border-radius: 22px;
          margin-bottom: 14px;
        }

        .smartSearchBox input {
          font-size: 15px;
        }

        .blogSection {
          padding: 34px 14px 54px;
        }

        .blogGrid {
          grid-template-columns: 1fr;
        }

        .blogDetail {
          width: calc(100% - 24px);
          padding: 24px 18px;
          border-radius: 24px;
        }

        .blogLead {
          font-size: 18px;
        }

        .fullscreenBtn {
          right: 12px;
          bottom: 12px;
          min-height: 40px;
          font-size: 13px;
        }

        .fullGalleryTop {
          top: 12px;
          left: 12px;
          right: 12px;
        }

        .fullGalleryTop button,
        .fullGalleryTop span {
          min-height: 40px;
          padding: 0 12px;
          font-size: 13px;
        }

        .fullArrow {
          width: 46px;
          height: 46px;
          font-size: 34px;
        }

        .fullArrow.left { left: 12px; }
        .fullArrow.right { right: 12px; }

        .fullGalleryImage {
          max-width: 100vw;
          max-height: 72vh;
        }

        .fullGalleryImage.zoomed {
          transform: scale(1.45);
        }

        .fullGalleryThumbs {
          justify-content: flex-start;
          bottom: 12px;
        }

        .contact {
          padding: 50px 18px 28px;
        }

        .contactGrid {
          grid-template-columns: 1fr;
        }

        .contactItem {
          padding: 26px 18px;
        }

        .socialBtn {
          width: 100%;
          max-width: 360px;
        }
      }



      .blogMoreRow {
        margin-top: 26px;
        display: flex;
        justify-content: center;
      }

      .blogCardImage {
        width: 100%;
        height: 190px;
        object-fit: cover;
        border-radius: 18px;
        margin-bottom: 16px;
        border: 1px solid rgba(255,255,255,.12);
      }

      .blogListPage {
        width: min(1180px, 92vw);
        margin: 0 auto;
        padding: 86px 0 40px;
      }

      .blogListPage h1 {
        margin: 12px 0 16px;
        font-size: clamp(38px, 5vw, 72px);
        line-height: 1;
        letter-spacing: -2px;
      }

      .blogListLead {
        max-width: 760px;
        color: rgba(255,255,255,.78);
        font-size: 19px;
        line-height: 1.7;
        font-weight: 650;
        margin-bottom: 34px;
      }

      .blogGridWide {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .blogHeroImage {
        width: 100%;
        max-height: 430px;
        object-fit: cover;
        border-radius: 30px;
        border: 1px solid rgba(255,255,255,.12);
        margin-bottom: 28px;
        box-shadow: 0 25px 70px rgba(0,0,0,.38);
      }

      .blogContentTextarea {
        min-height: 260px;
      }

      .blogCoverUpload {
        margin-top: 18px;
      }

      .blogCoverPreview {
        margin-top: 18px;
        max-width: 380px;
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.12);
      }

      .blogCoverPreview img {
        width: 100%;
        height: 210px;
        object-fit: cover;
        display: block;
      }

      .blogNoImage {
        width: 100%;
        height: 100%;
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,138,0,.12);
        color: var(--orange);
        font-weight: 950;
        font-size: 28px;
      }

      .blogAdminPanel {
        margin-top: 34px;
        border-color: rgba(255,138,0,.32);
      }

      .blogAdminGrid .adminListingCard {
        min-height: 220px;
      }

      .blogAdminGrid .adminListingImage {
        min-height: 180px;
      }

      @media (max-width: 900px) {
        .blogGridWide { grid-template-columns: 1fr; }
        .blogListPage { padding-top: 54px; }
      }

      @media (max-width: 420px) {
        .brandName { font-size: 23px; }
        .brandSlogan { font-size: 11px; max-width: 150px; }
        .navPill { font-size: 0; width: 42px; padding: 0; }
        .navPill::before { content: "⌂"; font-size: 18px; }
        .backPill::before { content: "←"; }
        .homePill { display: none; }
        .flagBox { width: 44px; height: 32px; }

        .heroTitle { font-size: 40px; }
        .heroText { font-size: 17px; }

        .imageWrap { height: 225px; }
        .buttonRow { grid-template-columns: 1fr; }
        .detailImageFrame {
          height: 50vh;
          min-height: 300px;
        }
      }.officeMap {
      max-width: 900px;
margin: 28px auto 0;
  margin-top: 28px;
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 20px 60px rgba(0,0,0,.28);
}

.officeMap iframe {
  width: 100%;
  height: 260px;
  border: 0;
  display: block;
}

      .contactFormWrap {
        max-width: 700px;
        margin: 48px auto 0;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 28px;
        padding: 40px;
      }
      .contactFormTitle {
        font-size: 28px;
        font-weight: 950;
        margin: 8px 0 10px;
        color: white;
      }
      .contactFormDesc {
        color: rgba(255,255,255,.65);
        margin: 0 0 28px;
        font-size: 15px;
        line-height: 1.6;
      }
      .contactForm { display: flex; flex-direction: column; gap: 14px; }
      .contactFormRow { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .contactInput {
        width: 100%;
        padding: 14px 18px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.14) !important;
        background: rgba(255,255,255,.06) !important;
        color: white !important;
        font-size: 15px;
        outline: none;
        transition: border-color .2s;
        box-sizing: border-box;
      }
      .contactInput:focus {
        border-color: rgba(255,138,0,.6) !important;
        box-shadow: 0 0 0 3px rgba(255,138,0,.1) !important;
      }
      .contactTextarea {
        width: 100%;
        min-height: 130px;
        padding: 14px 18px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.14) !important;
        background: rgba(255,255,255,.06) !important;
        color: white !important;
        font-size: 15px;
        outline: none;
        resize: vertical;
        transition: border-color .2s;
        box-sizing: border-box;
      }
      .contactTextarea:focus {
        border-color: rgba(255,138,0,.6) !important;
        box-shadow: 0 0 0 3px rgba(255,138,0,.1) !important;
      }
      .contactSubmit {
        background: var(--orange);
        color: #050505;
        border: none;
        border-radius: 999px;
        padding: 16px 36px;
        font-size: 16px;
        font-weight: 950;
        cursor: pointer;
        align-self: flex-start;
        transition: transform .2s, box-shadow .2s;
      }
      .contactSubmit:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(255,138,0,.35);
      }
      .contactSubmit:disabled { opacity: 0.6; cursor: not-allowed; }
      .contactSuccess {
        background: rgba(37,211,102,.12);
        border: 1px solid rgba(37,211,102,.3);
        border-radius: 16px;
        padding: 24px;
        color: #25D366;
        font-weight: 800;
        font-size: 16px;
        text-align: center;
      }
      .contactError { color: #ff6b6b; font-size: 14px; margin: 0; }

      /* ===== PREMIUM DETAIL PAGE ===== */

      .pdWrap {
        max-width: 1360px;
        margin: 0 auto;
        padding: 100px 40px 80px;
        display: grid;
        grid-template-columns: 1fr 420px;
        gap: 56px;
        align-items: start;
      }

      /* FOTO KOLONU */
      .pdPhotoCol { display: flex; flex-direction: column; gap: 8px; }

      .pdMainPhoto {
        position: relative;
        width: 100%;
        aspect-ratio: 4/3;
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        background: #111;
      }
      .pdMainPhoto img {
        width: 100%; height: 100%;
        object-fit: cover; object-position: center;
        display: block;
        transition: transform 0.4s ease;
        animation: pdFade 0.3s ease;
      }
      @keyframes pdFade {
        from { opacity: 0.5; transform: scale(1.04); }
        to { opacity: 1; transform: scale(1); }
      }
      .pdMainPhoto:hover img { transform: scale(1.02); }
      .pdPhotoOverlay {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%);
        pointer-events: none;
      }
      .pdArr {
        position: absolute; top: 50%; transform: translateY(-50%);
        background: rgba(255,255,255,0.92); color: #050505;
        border: none; border-radius: 50%;
        width: 44px; height: 44px;
        font-size: 22px; font-weight: 900;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background .2s, box-shadow .2s;
        box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        z-index: 10;
      }
      .pdArr.left { left: 14px; }
      .pdArr.right { right: 14px; }
      .pdArr:hover { background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.35); }
      .pdPhotoMeta {
        position: absolute; bottom: 14px; left: 0; right: 0;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 16px; z-index: 10;
      }
      .pdPhotoCount {
        background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
        color: white; padding: 5px 12px; border-radius: 999px;
        font-size: 13px; font-weight: 700;
      }
      .pdPhotoFull {
        background: rgba(0,0,0,0.65); backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,.25); color: white;
        padding: 7px 16px; border-radius: 999px;
        font-size: 13px; font-weight: 700; cursor: pointer;
        transition: background .2s;
      }
      .pdPhotoFull:hover { background: var(--orange); border-color: var(--orange); }

      .pdPhotoGrid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 6px;
      }
      .pdPhotoGridItem {
        position: relative;
        aspect-ratio: 1;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid transparent;
        cursor: pointer; padding: 0; background: #111;
        transition: border-color .2s, opacity .2s;
        opacity: 0.6;
      }
      .pdPhotoGridItem img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .pdPhotoGridItem.active { border-color: var(--orange); opacity: 1; }
      .pdPhotoGridItem:hover { opacity: 0.9; }
      .pdMoreOverlay {
        position: absolute; inset: 0;
        background: rgba(0,0,0,0.65);
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 18px; font-weight: 800;
        cursor: pointer;
      }

      /* BİLGİ KOLONU */
      .pdInfoCol {
        position: sticky;
        top: 100px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .pdBackBtn2 {
        align-self: flex-start;
        background: transparent;
        border: 1px solid rgba(255,255,255,.15);
        color: rgba(255,255,255,.65);
        border-radius: 999px;
        padding: 8px 18px;
        font-size: 13px; font-weight: 700;
        cursor: pointer;
        transition: color .2s, border-color .2s, background .2s;
      }
      .pdBackBtn2:hover { color: white; border-color: rgba(255,255,255,.4); background: rgba(255,255,255,.05); }

      .pdBadgeRow { display: flex; gap: 8px; }
      .pdB {
        padding: 4px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 800; letter-spacing: .3px;
      }
      .pdB.orange { background: var(--orange); color: #050505; }
      .pdB.outline { border: 1px solid rgba(255,255,255,.2); color: rgba(255,255,255,.75); }

      .pdH1 {
        font-size: clamp(20px, 2vw, 28px);
        font-weight: 800; color: white;
        margin: 0; line-height: 1.3;
        letter-spacing: -0.3px;
      }
      .pdLoc { color: rgba(255,255,255,.45); font-size: 13px; margin: 0; }
      .pdPriceMain {
        font-size: clamp(28px, 3vw, 42px);
        font-weight: 950; color: var(--orange);
        margin: 0; letter-spacing: -1px;
        border-bottom: 1px solid rgba(255,255,255,.07);
        padding-bottom: 18px;
      }

      .pdStatRow {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
      }
      .pdStat {
        display: flex; align-items: center; gap: 10px;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 14px; padding: 12px 14px;
      }
      .pdStat > span { font-size: 20px; }
      .pdStat div p { margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,.38); text-transform: uppercase; letter-spacing: .6px; font-weight: 700; }
      .pdStat div strong { font-size: 14px; color: white; font-weight: 800; }

      .pdTabBar {
        display: flex; gap: 0;
        border-bottom: 1.5px solid rgba(255,255,255,.08);
      }
      .pdTabBtn {
        padding: 10px 16px; border: none; background: transparent;
        color: rgba(255,255,255,.4); font-weight: 700; font-size: 13px;
        cursor: pointer;
        border-bottom: 2px solid transparent; margin-bottom: -1.5px;
        transition: color .2s, border-color .2s;
        white-space: nowrap;
      }
      .pdTabBtn.active { color: var(--orange); border-bottom-color: var(--orange); }
      .pdTabBtn:hover:not(.active) { color: rgba(255,255,255,.75); }

      .pdTabBody { min-height: 100px; }
      .pdPane { animation: tabFadeIn 0.25s ease; }
      .pdDescText { color: rgba(255,255,255,.78); font-size: 14px; line-height: 1.85; white-space: pre-line; margin: 12px 0 0; }
      .pdMapA {
        display: inline-flex; align-items: center; gap: 6px;
        margin-top: 14px; padding: 9px 18px;
        background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
        border-radius: 999px; color: rgba(255,255,255,.8); text-decoration: none;
        font-weight: 700; font-size: 13px; transition: background .2s;
      }
      .pdMapA:hover { background: rgba(255,138,0,.1); border-color: rgba(255,138,0,.3); color: var(--orange); }

      .pdFeatGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
      .pdFeatItem {
        display: flex; align-items: center; gap: 10px;
        background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
        border-radius: 12px; padding: 12px 14px;
      }
      .pdFeatItem > span { font-size: 18px; flex-shrink: 0; }
      .pdFeatItem div p { margin: 0 0 2px; font-size: 10px; color: rgba(255,255,255,.38); text-transform: uppercase; letter-spacing: .5px; font-weight: 700; }
      .pdFeatItem div strong { font-size: 13px; color: white; font-weight: 800; }

      .pdYatirimBox {
        display: flex; gap: 14px; margin-top: 12px;
        background: rgba(255,138,0,.06); border: 1px solid rgba(255,138,0,.15);
        border-radius: 16px; padding: 18px;
      }
      .pdYatirimBox > span { font-size: 24px; flex-shrink: 0; }
      .pdYatirimBox p { margin: 0; color: rgba(255,255,255,.8); font-size: 13px; line-height: 1.75; }

      .pdCTAStack { display: flex; flex-direction: column; gap: 10px; }
      .pdCtaWa {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        background: #25D366; color: white; text-decoration: none;
        padding: 15px; border-radius: 14px; font-weight: 800; font-size: 15px;
        transition: transform .2s, box-shadow .2s;
      }
      .pdCtaWa:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,.4); }
      .pdCtaInsta {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
        color: white; text-decoration: none;
        padding: 13px; border-radius: 14px; font-weight: 800; font-size: 14px;
        transition: transform .2s;
      }
      .pdCtaInsta:hover { transform: translateY(-2px); }
      .pdCtaMap {
        display: flex; align-items: center; justify-content: center; gap: 8px;
        background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
        color: rgba(255,255,255,.8); text-decoration: none;
        padding: 12px; border-radius: 14px; font-weight: 700; font-size: 13px;
        transition: background .2s;
      }
      .pdCtaMap:hover { background: rgba(255,255,255,.1); }

      .pdSecRow { display: flex; gap: 8px; }
      .pdSecRow button {
        flex: 1; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
        color: rgba(255,255,255,.65); border-radius: 12px; padding: 11px 8px;
        font-size: 12px; font-weight: 700; cursor: pointer; transition: background .2s, color .2s;
      }
      .pdSecRow button:hover { background: rgba(255,255,255,.1); color: white; }

      @media (max-width: 1024px) {
        .pdWrap { grid-template-columns: 1fr; padding: 90px 20px 60px; gap: 32px; }
        .pdInfoCol { position: static; }
        .pdStatRow { grid-template-columns: repeat(2, 1fr); }
        .pdPhotoGrid { grid-template-columns: repeat(4, 1fr); }
      }
      @media (max-width: 600px) {
        .pdWrap { padding: 80px 14px 40px; gap: 20px; }
        .pdPhotoGrid { grid-template-columns: repeat(3, 1fr); }
        .pdFeatGrid { grid-template-columns: 1fr; }
      }

      /* ===== SPLASH SCREEN ===== */
      .splashScreen {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: #050505;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: splashFadeOut 0.5s ease 1.5s forwards;
      }
      .splashInner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        animation: splashZoomIn 0.6s ease forwards;
      }
      .splashLogo { width: 80px; height: 80px; object-fit: contain; }
      .splashName { font-size: 26px; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
      .splashSlogan { font-size: 13px; color: rgba(255,255,255,.5); margin: 0; }
      .splashBar {
        width: 200px;
        height: 3px;
        background: rgba(255,255,255,.1);
        border-radius: 99px;
        margin-top: 16px;
        overflow: hidden;
      }
      .splashFill {
        height: 100%;
        background: var(--orange);
        border-radius: 99px;
        animation: splashProgress 1.4s ease forwards;
      }
      @keyframes splashZoomIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes splashFadeOut {
        to { opacity: 0; pointer-events: none; }
      }
      @keyframes splashProgress {
        from { width: 0%; }
        to { width: 100%; }
      }

      /* ===== HAMBURGER MENU ===== */
      .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        z-index: 200;
      }
      .hbar {
        display: block;
        width: 24px;
        height: 2px;
        background: white;
        border-radius: 2px;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      .open1 { transform: translateY(7px) rotate(45deg); }
      .open2 { opacity: 0; }
      .open3 { transform: translateY(-7px) rotate(-45deg); }
      .mobileMenu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(5,5,5,0.98);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(255,255,255,.1);
        display: flex;
        flex-direction: column;
        padding: 16px 24px 24px;
        gap: 4px;
        z-index: 150;
        animation: menuSlideDown 0.25s ease;
      }
      .mobileMenu a {
        color: white;
        text-decoration: none;
        font-size: 18px;
        font-weight: 700;
        padding: 12px 0;
        border-bottom: 1px solid rgba(255,255,255,.07);
        transition: color 0.2s;
      }
      .mobileMenu a:last-child { border-bottom: none; }
      .mobileMenu a:hover { color: var(--orange); }
      .mobileMenuContact {
        color: var(--orange) !important;
        font-weight: 800 !important;
      }
      @keyframes menuSlideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ===== SCROLL REVEAL ===== */
      .reveal {
        opacity: 0;
        transform: translateY(32px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* ===== FONT WEIGHT FIX ===== */
      .sectionTitle { font-weight: 800 !important; }
      .brandName { font-weight: 800 !important; }
      .heroTitle { font-weight: 800 !important; }

      /* ===== CARD IMPROVEMENT ===== */
      .card {
        background: rgba(255,255,255,.07) !important;
        border: 1px solid rgba(255,255,255,.1) !important;
      }
      .card:hover {
        background: rgba(255,255,255,.1) !important;
        border-color: rgba(255,138,0,.25) !important;
      }

      .navContactBtn {
        background: var(--orange) !important;
        color: #050505 !important;
        padding: 8px 20px !important;
        border-radius: 999px !important;
        font-weight: 800 !important;
        transition: transform .2s, box-shadow .2s !important;
      }
      .navContactBtn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(255,138,0,.35) !important;
      }

      .contactPageGrid {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        gap: 32px;
        align-items: start;
      }
      .contactPageInfo {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .contactPageCard {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 18px;
        padding: 18px 20px;
      }
      .contactPageIcon { font-size: 22px; margin-top: 2px; }
      .contactPageLabel { font-size: 13px; color: rgba(255,255,255,.5); margin: 0 0 4px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
      .contactPageValue { font-size: 15px; color: white; margin: 0; font-weight: 600; }
      .contactPageWa {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #25D366;
        color: white;
        font-weight: 800;
        font-size: 15px;
        padding: 14px 22px;
        border-radius: 999px;
        text-decoration: none;
        justify-content: center;
        transition: transform .2s, box-shadow .2s;
      }
      .contactPageWa:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(37,211,102,.4); }
      .contactPageForm {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 24px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      @media (max-width: 768px) {
        .contactPageGrid { grid-template-columns: 1fr; }
      }
      @media (max-width: 600px) {
        .contactFormWrap { padding: 24px 18px; }
        .contactFormRow { grid-template-columns: 1fr; }
      }

      .floatingWhatsapp {
        position: fixed;
        bottom: 28px;
        right: 28px;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        background: #25D366;
        color: #fff;
        font-weight: 950;
        font-size: 15px;
        padding: 14px 22px 14px 16px;
        border-radius: 999px;
        text-decoration: none;
        box-shadow: 0 8px 32px rgba(37,211,102,.45), 0 2px 8px rgba(0,0,0,.22);
        transition: transform .2s ease, box-shadow .2s ease;
        animation: waPulse 2.5s infinite;
      }

      .floatingWhatsapp img {
        width: 28px;
        height: 28px;
      }

      .floatingWhatsapp:hover {
        transform: translateY(-3px) scale(1.04);
        box-shadow: 0 16px 48px rgba(37,211,102,.55);
        animation: none;
      }

      @keyframes waPulse {
        0%, 100% { box-shadow: 0 8px 32px rgba(37,211,102,.45); }
        50% { box-shadow: 0 8px 48px rgba(37,211,102,.75), 0 0 0 8px rgba(37,211,102,.12); }
      }

      @media (max-width: 600px) {
        .floatingWhatsapp span { display: none; }
        .floatingWhatsapp { padding: 14px; bottom: 20px; right: 20px; }
      }
    
    `}</style>
  );
}
