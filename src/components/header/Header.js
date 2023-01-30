import { Fragment } from "react";
import InfoIcon from "../../components/infoIcon/InfoIcon";

const Header = () => {    
  // Returning header with logo, title and info icon
  return (
    <Fragment>
      <header className="header">
        <div className="circle"></div>
        <div className="header-content">
          <a href="https://imvilabs.com/" title="www.imvi.com" target={"blank"}>
            <img
              id="header-imvi-logo"
              src={process.env.PUBLIC_URL + "/images/imvi-logo.png"}
              alt="imvi labs logo"
            />
          </a>
          <h1 className="header-title">Pupillavstånd</h1>
          <InfoIcon id="show-info-btn-2"  />
        </div>
      </header>
    </Fragment>
  );
};

export default Header;
