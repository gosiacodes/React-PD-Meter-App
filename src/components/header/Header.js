import { Fragment } from "react";

const Header = () => {
  // Returning header with logo and title
  return (
    <Fragment>
      <header className="header">
        <div className="circle"></div>
        <div className="header-content">
          <a href="https://imvilabs.com/" title="imvi's homepage">
            <img
              id="header-imvi-logo"
              src={process.env.PUBLIC_URL + "/images/imvi-logo.png"}
              alt="imvi labs logo"
            />
          </a>
          <h1 className="header-title">PD meter</h1>
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
