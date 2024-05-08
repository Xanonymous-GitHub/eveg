const HEADER_HTML: string = `
<div class="sticky-top" height="100">
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a href="/" class="d-flex align-items-center text-decoration-none">
        <img src="/shop.avif" alt="logo" class="d-inline-block align-text-top" width="36" height="36" />
        <span class="navbar-brand text-black mx-2"><b>E-Veg</b></span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" href="/"><i class="bi bi-house"></i> Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/about.html"><i class="bi bi-info-circle"></i> About</a>
          </li>
        </ul>
        <!-- TODO: Position absolute center -->
        ${isHome()
? `
        <form class="d-flex search flex-lg-row flex-column align-items-center mx-auto" role="search">
          <input class="form-control me-2" id="searchbox" type="search" placeholder="Search" aria-label="Search" />
          <span class="d-flex flex-row">
            <button id="searchbutton" class="btn btn-success btn-sm mx-1" type="submit">Search</button>
            <button id="closesearchbutton" class="btn btn-outline-danger btn-sm mx-1" type="submit" disabled>Cancel</button>
          </span>
        </form>
        `
: ''}
        <ul class="navbar-nav me-2">
          <li class="nav-item">
            <a class="nav-link active" href="/checkout.html"><i class="bi bi-cart"></i> Checkout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
`

function isHome(): boolean {
  return window.location.pathname.toLowerCase() === '/'
}

document.body.insertAdjacentHTML('afterbegin', HEADER_HTML)
