export const Home = () => {
  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Chat app demo</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => window.open("https://react-redux.js.org/")}
            >
              GitHub
            </button>
          </div>
        </div>
      </div>
      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h5 className="display-6 fw-bold">
            What should we implement in this project?
          </h5>
          <div className="col-md-8 fs-4 mb-3">
            <ol>
              <li>Koa (pure API backend)</li>
              <li>CRA (React-Redux app)</li>
              <li>MongoDB</li>
              <li>Redis (pub/sub, multi-container app)</li>
              <li>WebSocket (wss messenger app)</li>
            </ol>
            Happy coding with pure JavaScript!
          </div>
          <a href="mailto:arworkacc@gmail.com">
            <button className="btn btn-primary btn-lg" type="button">
              Contact us
            </button>
          </a>
        </div>
      </div>
    </main>
  )
}
