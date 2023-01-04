import { Fragment } from "react";

const Header = () => {
  // Returning header with logo and title
  return (
    <Fragment>
      <header className="header">
        <a href="https://imvilabs.com/" title="imvi's homepage">
          <img
            src={process.env.PUBLIC_URL + "/images/imvi-logo.png"}
            alt="imvi labs logo"
          />
        </a>
        <h1 className="header-title">PD meter</h1>
      </header>
    </Fragment>
  );
};

export default Header;
